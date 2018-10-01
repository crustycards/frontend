import {ProxyHandlerOptions} from 'h2o2';
import {ResponseToolkit, RequestQuery, Request as HapiRequest} from 'hapi';

export interface ProxyResponseToolkit extends ResponseToolkit {
  proxy(options: ProxyHandlerOptions): void
}

export interface Request extends HapiRequest {
  query: RequestQuery
}