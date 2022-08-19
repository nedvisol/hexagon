import fs from 'fs';
import path from 'path';
import Serverless from 'serverless';
import { getGlobalHexagonRegistry, IRestMetadata, IRestMethod, restMetadataKey } from '@nedvisol/hexagon-core';
import ejs from 'ejs';

const hexaTsDir = '.hexa-ts';
const globalRestControllers = getGlobalHexagonRegistry().restControllers;

interface IControllerConfig {
  controllerClass: string
  file: string
}

export default class HexaTsPlugin {
  serverless: Serverless;
  hooks: any;

  constructor (serverless: Serverless) {
    // The plugin is loaded
    this.serverless = serverless;
    this.hooks = {
      initialize: async () => await this.init()
    };
  }

  async processRestControllers (provider: string): Promise<void> {
    const handlerRestTemplate: string = fs.readFileSync(path.join(__dirname, `/templates/handler-${provider}-rest.ejs`)).toString();

    const controllerConfigList = this.serverless.service.custom.hexaTsPlugin.controllers;

    for (const controllerInfo of globalRestControllers) {
      // console.log(`controller ${controller}`);
      const { constructor } = controllerInfo;
      const controller = constructor;
      const existingRestMetadata: IRestMetadata = Reflect.getOwnMetadata(restMetadataKey, controller.prototype);
      const controllerConfig = (controllerConfigList as IControllerConfig[]).find(v => (v.controllerClass === controller.name));
      if (!existingRestMetadata || (controllerConfig == null)) {
        console.log('cannot find Rest metadata');
        continue;
      }
      const controllerFile = `${process.cwd()}/${controllerConfig.file}`;
      for (const propertyKey of Object.keys(existingRestMetadata)) {
        const restMethod: IRestMethod = existingRestMetadata[propertyKey];

        const fileName = `${process.cwd()}/${hexaTsDir}/${controller.name as string}_${propertyKey}.ts`;
        const moduleImport = path.relative(`${process.cwd()}/${hexaTsDir}`, controllerFile).replace(/.ts$/, '');
        const handlerCode = ejs.render(handlerRestTemplate, {
          controller,
          moduleImport,
          propertyKey,
          restMethod
        });
        fs.writeFileSync(fileName, handlerCode);
        this.serverless.service.functions[`${controller.name as string}_${propertyKey}`] = {
          handler: `${hexaTsDir}/${controller.name as string}_${propertyKey}.main`,
          events: [
            {
              http: {
                method: restMethod.method,
                path: restMethod.path
              }
            }
          ]
        };
      }
    }
  }

  async init (): Promise<void> {
    if (!fs.existsSync(hexaTsDir)) {
      fs.mkdirSync(hexaTsDir);
    }

    const provider = this.serverless.service.provider.name;
    await this.processRestControllers(provider);
  }
}

module.exports = HexaTsPlugin;
