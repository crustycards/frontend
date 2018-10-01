import {ProxyHandlerOptions} from 'h2o2';
import {Request as HapiRequest, RequestQuery, ResponseToolkit} from 'hapi';

export interface ProxyResponseToolkit extends ResponseToolkit {
  proxy(options: ProxyHandlerOptions): void;
}

export interface Request extends HapiRequest {
  query: RequestQuery;
}
