import 'reflect-metadata';

export interface IHexagonRegistry {
  restControllers: any[]
}

export interface IRestMetadata {
  [key: string]: IRestMethod
}

export type TRestMethods = 'get' | 'post' | 'put' | 'delete' | 'options';
export type TRestParamTypes = 'querystring' | 'path' | 'header' | 'body';

export interface IRestMethod {
  method: TRestMethods
  path: string
  parameters?: IRestMethodParameters
  descriptor?: PropertyDescriptor
}

export interface IRestMethodParameters {
  [key: number]: IRestMethodParameter
}

export interface IRestMethodParameter {
  paramType: TRestParamTypes
  paramName: string
}

declare global {
  var RestMetadataKey: symbol;
  var _HexagonRegistry: IHexagonRegistry;
}

export const restMetadataKey: symbol = (global as any).RestMetadataKey || Symbol('RestMetadata');
global.RestMetadataKey = restMetadataKey;

export function getGlobalRestMetadataKey (): Symbol {
  return restMetadataKey;
}

export function getGlobalHexagonRegistry (): IHexagonRegistry {
  const hexagonRegistry: IHexagonRegistry = globalThis._HexagonRegistry || { restControllers: [] };
  globalThis._HexagonRegistry = hexagonRegistry;
  return hexagonRegistry;
}
