import {Session} from '../dao';

interface AuthApi {
  getUserSessions(): Promise<Session[]>;
  deleteSession(sessionId: string): Promise<void>;
}

export default AuthApi;
