import { Session } from '../dao';

interface AuthApi {
  linkSessionToFirebase(firebaseToken: string): Promise<void>;
  getUserSessions(): Promise<Session[]>;
  deleteSession(sessionId: string): Promise<void>;
}

export default AuthApi;
