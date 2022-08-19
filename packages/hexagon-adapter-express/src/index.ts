import { Application, RequestHandler } from 'express';
import { getGlobalHexagonRegistry, IRestMetadata, IRestMethod, restMetadataKey } from '@nedvisol/hexagon-core';

function expressMiddlewareFactory (restMethod: IRestMethod, controllerInstance: any): RequestHandler {
  return async (req, res): Promise<void> => {
    const args: any[] = (restMethod.parameters != null) ? Array(Object.keys(restMethod.parameters).length) : [];
    if (restMethod.parameters != null) {
      for (const paramIndex of Object.keys(restMethod.parameters)) {
        const paramMetadata = restMethod.parameters[paramIndex as any];
        let paramVal = null;
        if (paramMetadata.paramType === 'path') {
          paramVal = req.params[paramMetadata.paramName];
        } else if (paramMetadata.paramType === 'querystring') {
          paramVal = req.query[paramMetadata.paramName];
        } else if (paramMetadata.paramType === 'header') {
          paramVal = req.headers[paramMetadata.paramName];
        } else if (paramMetadata.paramType === 'body') {
          if (paramMetadata.paramName === 'raw') {
            paramVal = req.body;
          } else if (paramMetadata.paramName === 'json') {
            paramVal = JSON.parse(req.body);
          }
        }
        args[paramIndex as any] = paramVal;
      }
    }
    if (restMethod.descriptor == null) {
      throw Error('internal error');
    }
    const retVal = await (restMethod.descriptor.value as Function).apply(controllerInstance, args);
    res.send(JSON.stringify(retVal));
    return await Promise.resolve();
  };
}

export function initializeExpressApp (app: Application): void {
  const globalRestControllers = getGlobalHexagonRegistry().restControllers;
  for (const controllerInfo of globalRestControllers) {
    const { constructor: Controller } = controllerInfo;
    const controllerInstance = new Controller();
    const existingRestMetadata: IRestMetadata | undefined = Reflect.getOwnMetadata(restMetadataKey, Controller.prototype);
    if ((existingRestMetadata == null) || existingRestMetadata === null) continue;
    for (const propertyKey of Object.keys(existingRestMetadata)) {
      const restMethod: IRestMethod = existingRestMetadata[propertyKey];
      if (!restMethod.path ||
      (restMethod.descriptor === null) || !restMethod.method) continue;
      app[restMethod.method](restMethod.path, expressMiddlewareFactory(restMethod, controllerInstance));
    }
  }
}
