import {ProxyHandlerOptions} from '@hapi/h2o2';
import {Request as HapiRequest, RequestQuery, ResponseObject, ResponseToolkit} from '@hapi/hapi';

export interface ProxyResponseToolkit extends ResponseToolkit {
  proxy(options: ProxyHandlerOptions): Promise<ResponseObject>;
}

export interface Request extends HapiRequest {
  query: RequestQuery;
}
