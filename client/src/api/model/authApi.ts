interface AuthApi {
  linkSessionToFirebase(firebaseToken: string): Promise<void>
}

export default AuthApi;
