/* eslint @typescript-eslint/no-var-requires: "off" */
import { assert } from 'chai';
import Sinon from 'sinon';
import HexaTsPlugin from '../src/index';
import { } from 'reflect-metadata';
import { getGlobalHexagonRegistry, IRestMetadata, restMetadataKey } from '@nedvisol/hexagon-core';

const fs = require('fs');
const ejs = require('ejs');
const globalHexagonRegistry = getGlobalHexagonRegistry().restControllers;

describe('#class HexaTsPlugin', () => {
  describe('#constructor()', () => {
    it('should populate hook', () => {
      const slsInstance: any = Sinon.stub();
      const plugin = new HexaTsPlugin(slsInstance);

      assert.isDefined(plugin.hooks);
      assert.isDefined(plugin.hooks.initialize);
      assert.isFunction(plugin.hooks.initialize);
    });
  });

  describe('#processRestControllers', () => {
    it('should generate the right handler helps', async () => {
      const readFileSyncStub = Sinon.stub(fs, 'readFileSync').returns('template-content');
      const writeFileSyncStub = Sinon.stub(fs, 'writeFileSync');
      const ejsRenderStub = Sinon.stub(ejs, 'render').returns('rendered code');
      const slsInstance: any = {
        service: {
          functions: {},
          custom: {
            hexaTsPlugin: {
              controllers: [{
                controllerClass: 'ControllerClass',
                file: 'filename'
              }]
            }
          }
        }
      };
      const plugin = new HexaTsPlugin(slsInstance);

      const restMetadata: IRestMetadata = {
        getMethod: {
          method: 'get',
          path: '/path-value'
        }
      };

      class ControllerClass {
        getMethod (): void {

        }
      }
      Reflect.defineMetadata(restMetadataKey, restMetadata, ControllerClass.prototype);
      globalHexagonRegistry.push({ constructor: ControllerClass });
      await plugin.processRestControllers('provider-value');

      assert.isTrue(readFileSyncStub.called);
      assert.isTrue((readFileSyncStub.firstCall.args[0] as string).endsWith('/templates/handler-provider-value-rest.ejs'));

      // ejs is called
      assert.isTrue(ejsRenderStub.called);
      assert.deepEqual(ejsRenderStub.firstCall.args, [
        'template-content',
        {
          controller: ControllerClass,
          moduleImport: '../filename',
          propertyKey: 'getMethod',
          restMethod: { method: 'get', path: '/path-value' }
        }
      ]);

      // writefilesync is called
      assert.isTrue(writeFileSyncStub.called);
      assert.isTrue(writeFileSyncStub.firstCall.args[0].endsWith('/ControllerClass_getMethod.ts'));
      assert.equal(writeFileSyncStub.firstCall.args[1], 'rendered code');

      assert.deepEqual(slsInstance.service.functions, { ControllerClass_getMethod: { handler: '.hexa-ts/ControllerClass_getMethod.main', events: [{ http: { method: 'get', path: '/path-value' } }] } });
    });
  });
});
