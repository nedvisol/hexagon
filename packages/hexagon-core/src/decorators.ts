import { TRestMethods, IRestMetadata, restMetadataKey, IRestMethod, TRestParamTypes, getGlobalHexagonRegistry } from './core';

export type RestBodyEncoding = 'raw' | 'json';
export interface IRestBodyMapping {
  encoding: RestBodyEncoding
}

export function RestController () {
  return function (constructor: Function) {
    const globalHexagonRegistry = getGlobalHexagonRegistry();
    const globalRestControllers = globalHexagonRegistry.restControllers;
    globalRestControllers.push({ constructor });
  };
}

export function RestGetMapping (path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    RestMethodMapping('get', path, target, propertyKey, descriptor);
  };
}

export function RestPostMapping (path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    RestMethodMapping('post', path, target, propertyKey, descriptor);
  };
}
export function RestPutMapping (path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    RestMethodMapping('put', path, target, propertyKey, descriptor);
  };
}
export function RestDeleteMapping (path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    RestMethodMapping('delete', path, target, propertyKey, descriptor);
  };
}
export function RestOptionsMapping (path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    RestMethodMapping('options', path, target, propertyKey, descriptor);
  };
}

export function RestPathParam (paramName: string) {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    RestParamMapping(paramName, 'path', target, propertyKey, parameterIndex);
  };
}

export function RestQueryParam (paramName: string) {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    RestParamMapping(paramName, 'querystring', target, propertyKey, parameterIndex);
  };
}

export function RestHeaderParam (paramName: string) {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    RestParamMapping(paramName, 'header', target, propertyKey, parameterIndex);
  };
}

export function RestBody (options?: IRestBodyMapping) {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    RestParamMapping((options != null) ? options.encoding : 'raw', 'body', target, propertyKey, parameterIndex);
  };
}

function RestMethodMapping (method: TRestMethods, path: string, target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
  const existingRestMetadata: IRestMetadata = Reflect.getOwnMetadata(restMetadataKey, target) || {};
  const restMethod: IRestMethod = existingRestMetadata[propertyKey] || {};
  restMethod.path = path;
  restMethod.method = method;
  restMethod.descriptor = descriptor;
  existingRestMetadata[propertyKey] = restMethod;
  Reflect.defineMetadata(restMetadataKey, existingRestMetadata, target);
}

function RestParamMapping (paramName: string, paramType: TRestParamTypes, target: Object, propertyKey: string, parameterIndex: number): void {
  const existingRestMetadata: IRestMetadata = Reflect.getOwnMetadata(restMetadataKey, target) || {};
  const restMethod: IRestMethod = existingRestMetadata[propertyKey] || {};
  if (restMethod.parameters == null) {
    restMethod.parameters = [];
  }
  restMethod.parameters[parameterIndex] = { paramType, paramName };
  existingRestMetadata[propertyKey] = restMethod;
  Reflect.defineMetadata(restMetadataKey, existingRestMetadata, target);
}
