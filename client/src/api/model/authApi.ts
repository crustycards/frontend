import { Session } from "../dao";

interface AuthApi {
  linkSessionToFirebase(firebaseToken: string): Promise<void>
  getUserSessions(): Promise<Session[]>
}

export default AuthApi;
