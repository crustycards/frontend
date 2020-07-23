import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway
} from '@nestjs/websockets';
import * as cookie from 'cookie';
import {Socket} from 'socket.io';
import {AuthService} from './auth/auth.service';
import {RabbitMQService} from './rabbitmq.service';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private socketsByUserName: Map<string, Set<Socket>> = new Map();
  private userNamesBySocket: Map<Socket, string> = new Map();
  private anonymousSockets: Set<Socket> = new Set();

  constructor(
    private readonly authService: AuthService,
    rabbitMQService: RabbitMQService
  ) {
    rabbitMQService.onGameMessage((message) => {
      switch (message.type) {
        case 'GAME_UPDATED':
          const userNames: string[] = message.payload;
          userNames.forEach((userName) => {
            this.sendMessageToUser(userName, 'GAME_UPDATED');
          });
          break;
      }
    });
  }

  // Called automatically from OnGatewayConnection
  public async handleConnection(socket: Socket) {
    const userName = await this.getSocketOwnerName(socket);

    if (!userName) {
      this.anonymousSockets.add(socket);
    } else {
      this.userNamesBySocket.set(socket, userName);
      if (!this.socketsByUserName.has(userName)) {
        this.socketsByUserName.set(userName, new Set());
      }
      const byUserNameEntry = this.socketsByUserName.get(userName);
      if (byUserNameEntry !== undefined) {
        byUserNameEntry.add(socket);
      }
    }
  }

  // Called automatically from OnGatewayDisconnect
  public async handleDisconnect(socket: Socket) {
    const userName = this.userNamesBySocket.get(socket);

    if (!userName) {
      this.anonymousSockets.delete(socket);
    } else {
      this.userNamesBySocket.delete(socket);
      const byUserNameEntry = this.socketsByUserName.get(userName);
      if (byUserNameEntry) {
        byUserNameEntry.delete(socket);
        if (byUserNameEntry.size === 0) {
          this.socketsByUserName.delete(userName);
        }
      }
    }
  }

  private sendMessageToUser(userName: string, message: any) {
    const socketEntry = this.socketsByUserName.get(userName);
    if (socketEntry) {
      socketEntry.forEach((socket) => {
        socket.send(message);
      });
    }
  }

  private async getSocketOwnerName(socket: Socket):
  Promise<string | undefined> {
    let userName: string | undefined;
    try {
      if (socket.request.headers.cookie) {
        const authToken = cookie.parse(socket.request.headers.cookie).authToken;
        if (authToken) {
          userName = this.authService.decodeJwtToUserName(authToken);
        }
      }
    } catch (err) {
      // User remains undefined
    }
    return userName;
  }
}
