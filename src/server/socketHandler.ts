import {Server} from 'http';
import * as SocketIO from 'socket.io';
import {User} from '../client/src/api/dao';
import Api from './api';

class SocketHandler {
  private static parseCookieString(cookieString: string): {[key: string]: string} {
    return cookieString.split('; ').map((individualCookie) => {
      const cookieName = individualCookie.split('=')[0];
      return [cookieName, individualCookie.substr(cookieName.length + 1)];
    }).reduce((obj, b) => {
      return {...obj, [b[0]]: b[1]};
    }, {});
  }

  private socketsByUserId: Map<string, Set<SocketIO.Socket>> = new Map();
  private anonymousSockets: Set<SocketIO.Socket> = new Set();
  private api: Api;

  constructor(serverListener: Server, api: Api) {
    const io = SocketIO.listen(serverListener);
    io.sockets.on('connection', async (socket) => {
      const socketOwner = await this.getSocketOwner(socket);
      console.log(`${socketOwner ? socketOwner.name : 'Anonymous user'} just connected!`);
      this.addSocket(socket, socketOwner);

      socket.on('disconnect', () => {
        console.log(`${socketOwner ? socketOwner.name : 'Anonymous user'} disconnected!`);
        this.removeSocket(socket, socketOwner);
      });
    });
    this.api = api;
  }

  public sendMessageToUser(userId: string, message: any) {
    if (this.socketsByUserId.has(userId)) {
      this.socketsByUserId.get(userId).forEach((socket) => {
        socket.send(message);
      });
    }
  }

  public sendMessageToAllAuthenticatedUsers(message: any) {
    this.socketsByUserId.forEach((socketSet) => {
      socketSet.forEach((socket) => {
        socket.send(message);
      });
    });
  }

  public sendMessageToAllAnonymousUsers(message: any) {
    this.anonymousSockets.forEach((socket) => {
      socket.send(message);
    });
  }

  private addSocket(socket: SocketIO.Socket, user: User) {
    if (user === null) {
      this.anonymousSockets.add(socket);
    } else {
      if (!this.socketsByUserId.has(user.id)) {
        this.socketsByUserId.set(user.id, new Set());
      }
      this.socketsByUserId.get(user.id).add(socket);
    }
  }

  private removeSocket(socket: SocketIO.Socket, user: User) {
    if (user === null) {
      this.anonymousSockets.delete(socket);
    } else {
      this.socketsByUserId.get(user.id).delete(socket);
      if (this.socketsByUserId.get(user.id).size === 0) {
        this.socketsByUserId.delete(user.id);
      }
    }
  }

  private async getSocketOwner(socket: SocketIO.Socket) {
    try {
      const base64EncodedSessionCookie = SocketHandler.parseCookieString(socket.request.headers.cookie).session;
      if (!base64EncodedSessionCookie) {
        return null;
      }
      const decodedSessionCookie = require('atob')(base64EncodedSessionCookie).replace('"', '').replace('"', '');
      const session = await this.api.auth.getSession(decodedSessionCookie);
      if (!session) {
        return null;
      }
      const user = await this.api.user.getById(session.userId);
      return user;
    } catch (e) {
      return null;
    }
  }
}

export default SocketHandler;
