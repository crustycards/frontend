import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway
} from '@nestjs/websockets';
import * as cookie from 'cookie';
import {Socket} from 'socket.io';
import {RabbitMQService} from './rabbitmq.service';
import {User} from './user/interfaces/user.interface';
import {UserService} from './user/user.service';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private socketsByUserId: Map<string, Set<Socket>> = new Map();
  private userIdsBySocket: Map<Socket, string> = new Map();
  private anonymousSockets: Set<Socket> = new Set();

  constructor(private readonly userService: UserService, rabbitMQService: RabbitMQService) {
    rabbitMQService.onGameMessage((message) => {
      switch (message.type) {
        case 'GAME_UPDATED':
          const userIds: string[] = message.payload;
          userIds.forEach((userId) => {
            this.sendMessageToUser(userId, 'GAME_UPDATED');
          });
          break;
        case 'GAME_LIST_UPDATED':
          this.sendMessageToAllAuthenticatedUsers('GAME_LIST_UPDATED');
          break;
      }
    });
  }

  // Called automatically from OnGatewayConnection
  public async handleConnection(socket: Socket) {
    const user = await this.getSocketOwner(socket);

    if (!user) {
      this.anonymousSockets.add(socket);
    } else {
      this.userIdsBySocket.set(socket, user.id);
      if (!this.socketsByUserId.has(user.id)) {
        this.socketsByUserId.set(user.id, new Set());
      }
      this.socketsByUserId.get(user.id).add(socket);
    }
  }

  // Called automatically from OnGatewayDisconnect
  public async handleDisconnect(socket: Socket) {
    const userId = this.userIdsBySocket.get(socket);

    if (!userId) {
      this.anonymousSockets.delete(socket);
    } else {
      this.userIdsBySocket.delete(socket);
      this.socketsByUserId.get(userId).delete(socket);
      if (this.socketsByUserId.get(userId).size === 0) {
        this.socketsByUserId.delete(userId);
      }
    }
  }

  private sendMessageToUser(userId: string, message: any) {
    if (this.socketsByUserId.has(userId)) {
      this.socketsByUserId.get(userId).forEach((socket) => {
        socket.send(message);
      });
    }
  }

  private sendMessageToAllAuthenticatedUsers(message: any) {
    this.socketsByUserId.forEach((socketSet) => {
      socketSet.forEach((socket) => {
        socket.send(message);
      });
    });
  }

  private sendMessageToAllAnonymousUsers(message: any) {
    this.anonymousSockets.forEach((socket) => {
      socket.send(message);
    });
  }

  private async getSocketOwner(socket: Socket): Promise<User> {
    let user: User;
    try {
      if (socket.request.headers.cookie) {
        const sessionId = cookie.parse(socket.request.headers.cookie).session;
        if (sessionId) {
          user = await this.userService.getBySessionId(sessionId);
        }
      }
    } catch (err) {
      // User remains undefined
    }
    return user;
  }
}
