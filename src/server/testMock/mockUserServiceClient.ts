import * as UserServiceGrpc from '../../../proto-gen-out/crusty_cards_api/user_service_grpc_pb';
import * as grpc from '@grpc/grpc-js';

export const mockUserServiceClient = new UserServiceGrpc.UserServiceClient('localhost:8080', grpc.credentials.createInsecure());