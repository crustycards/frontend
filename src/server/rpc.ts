import axios from 'axios';
import {Response} from 'express';
import {ServiceError} from '@grpc/grpc-js';
import {
  opaqueSerializedStringToUint8Array,
  uint8ArrayToOpaqueSerializedString
} from '../client/src/helpers/serialize';

// TODO - Clean both of these functions up and add better error handling.

// This file contains functions used by both this server and by the web client
// to provide an ad-hoc RPC system that relies on the generated proto types.

// Makes an rpc call from the web browser.
export const makeRpcFromBrowser = async <
  RequestType extends {serializeBinary(): Uint8Array},
  ResponseType
>(
  request: RequestType,
  path: string,
  decodeResponse: (bytes: Uint8Array) => ResponseType
): Promise<ResponseType> => {
  const res = await axios.post(`/api/${path}`, {
    data: uint8ArrayToOpaqueSerializedString(request.serializeBinary())
  });
  if (!res.status.toString().startsWith('2')) {
    throw new Error(`Expected 2xx response code, got ${res.status}`);
  }

  if (typeof res.data !== 'string') {
    throw new Error(`Response data type should be string - got ${typeof res.data}`);
  }

  try {
    return decodeResponse(opaqueSerializedStringToUint8Array(res.data));
  } catch (err) {
    throw new Error('Unable to decode response');
  }
};

// Dynamically handles an incoming rpc to the server.
export const handleRequest =
<RequestType, ResponseType extends {serializeBinary(): Uint8Array}>(
  body: any,
  res: Response,
  decodeRequest: (bytes: Uint8Array) => RequestType,
  grpcMethod: (
    request: RequestType,
    callback: (error: ServiceError | null, response: ResponseType) => void
  ) => void,
  validateRequest?: (request: RequestType) => RequestType | ServiceError) => {
    if (typeof body !== 'object') {
      return res.status(400).send(`Unable to parse request - request body ` +
                                  `must be a object. Got ${typeof body}`);
    }

    if (typeof body.data !== 'string') {
      return res.status(400).send(`Unable to parse request - request body ` +
                                  `object must contain a key 'data' with a string value.`);
    }

    // TODO - Add some more rigorous error handling here.
    let request = decodeRequest(opaqueSerializedStringToUint8Array(body.data));
    if (validateRequest) {
      const validationResult = validateRequest(request);
      if (validationResult instanceof Error) {
        return res.status(400).send(validationResult.message);
      } else {
        request = validationResult;
      }
    }

    grpcMethod(request, (grpcError, grpcResponse) => {
      if (grpcError) {
        return res.status(400).send(grpcError.message);
      } else {
        return res.send(uint8ArrayToOpaqueSerializedString(
          grpcResponse.serializeBinary()));
      }
    });
};
