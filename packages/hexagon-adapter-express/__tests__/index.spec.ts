/* eslint @typescript-eslint/no-extraneous-class: "off" */
import { assert } from 'chai';
import rewire from 'rewire';
import Sinon from 'sinon';
import 'reflect-metadata';

import { getGlobalHexagonRegistry, IRestMetadata, IRestMethod, restMetadataKey } from '@nedvisol/hexagon-core';
import { initializeExpressApp } from '../src/index';

const adapterModule = rewire('../src/index.ts');
const expressMiddlewareFactory = adapterModule.__get__('expressMiddlewareFactory');

describe('#expressMiddlewareFactory()', () => {
  it('should return an express middleware function that properly maps the method', async () => {
    const controllerMethodStub = Sinon.stub().returns('return-value');

    const restMethod: IRestMethod = {
      method: 'get',
      path: '/path-value',
      descriptor: {
        value: controllerMethodStub
      }
    };

    class Foo {

    }
    const controllerInstance = new Foo();
    const req = {};
    const res = {
      send: Sinon.spy()
    };

    const middlewareFn = expressMiddlewareFactory(restMethod, controllerInstance);
    await middlewareFn(req, res);
    // restMethod is called with no args
    assert.isTrue(controllerMethodStub.called);
    assert.deepEqual(controllerMethodStub.firstCall.args, []);

    // respond is sent with returned value
    assert.equal(res.send.firstCall.args[0], JSON.stringify('return-value'));
  });

  it('should return an express middleware function that properly maps the method, and path param', async () => {
    const controllerMethodStub = Sinon.stub().returns('return-value');

    const restMethod: IRestMethod = {
      method: 'get',
      path: '/path-value',
      descriptor: {
        value: controllerMethodStub
      },
      parameters: [
        {
          paramName: 'param-1',
          paramType: 'path'
        }
      ]
    };

    class Foo {

    }
    const controllerInstance = new Foo();
    const req = {
      params: {
        'param-1': 'param-1-value'
      }
    };
    const res = {
      send: Sinon.spy()
    };

    const middlewareFn = expressMiddlewareFactory(restMethod, controllerInstance);
    await middlewareFn(req, res);
    // restMethod is called with arg from request
    assert.isTrue(controllerMethodStub.called);
    assert.deepEqual(controllerMethodStub.firstCall.args, ['param-1-value']);

    // respond is sent with returned value
    assert.equal(res.send.firstCall.args[0], JSON.stringify('return-value'));
  });

  it('should return an express middleware function that properly maps the method, and query param', async () => {
    const controllerMethodStub = Sinon.stub().returns('return-value');

    const restMethod: IRestMethod = {
      method: 'get',
      path: '/path-value',
      descriptor: {
        value: controllerMethodStub
      },
      parameters: [
        {
          paramName: 'param-1',
          paramType: 'querystring'
        }
      ]
    };

    class Foo {

    }
    const controllerInstance = new Foo();
    const req = {
      query: {
        'param-1': 'param-1-value'
      }
    };
    const res = {
      send: Sinon.spy()
    };

    const middlewareFn = expressMiddlewareFactory(restMethod, controllerInstance);
    await middlewareFn(req, res);
    // restMethod is called with arg from request
    assert.isTrue(controllerMethodStub.called);
    assert.deepEqual(controllerMethodStub.firstCall.args, ['param-1-value']);

    // respond is sent with returned value
    assert.equal(res.send.firstCall.args[0], JSON.stringify('return-value'));
  });

  it('should return an express middleware function that properly maps the method, and header param', async () => {
    const controllerMethodStub = Sinon.stub().returns('return-value');

    const restMethod: IRestMethod = {
      method: 'get',
      path: '/path-value',
      descriptor: {
        value: controllerMethodStub
      },
      parameters: [
        {
          paramName: 'param-1',
          paramType: 'header'
        }
      ]
    };

    class Foo {

    }
    const controllerInstance = new Foo();
    const req = {
      headers: {
        'param-1': 'param-1-value'
      }
    };
    const res = {
      send: Sinon.spy()
    };

    const middlewareFn = expressMiddlewareFactory(restMethod, controllerInstance);
    await middlewareFn(req, res);
    // restMethod is called with arg from request
    assert.isTrue(controllerMethodStub.called);
    assert.deepEqual(controllerMethodStub.firstCall.args, ['param-1-value']);

    // respond is sent with returned value
    assert.equal(res.send.firstCall.args[0], JSON.stringify('return-value'));
  });

  it('should return an express middleware function that properly maps the method, and raw body', async () => {
    const controllerMethodStub = Sinon.stub().returns('return-value');

    const restMethod: IRestMethod = {
      method: 'get',
      path: '/path-value',
      descriptor: {
        value: controllerMethodStub
      },
      parameters: [
        {
          paramName: 'raw',
          paramType: 'body'
        }
      ]
    };

    class Foo {

    }
    const controllerInstance = new Foo();
    const req = {
      body: 'body-value'
    };
    const res = {
      send: Sinon.spy()
    };

    const middlewareFn = expressMiddlewareFactory(restMethod, controllerInstance);
    await middlewareFn(req, res);
    // restMethod is called with arg from request
    assert.isTrue(controllerMethodStub.called);
    assert.deepEqual(controllerMethodStub.firstCall.args, ['body-value']);

    // respond is sent with returned value
    assert.equal(res.send.firstCall.args[0], JSON.stringify('return-value'));
  });

  it('should return an express middleware function that properly maps the method, and JSON body', async () => {
    const controllerMethodStub = Sinon.stub().returns('return-value');

    const restMethod: IRestMethod = {
      method: 'get',
      path: '/path-value',
      descriptor: {
        value: controllerMethodStub
      },
      parameters: [
        {
          paramName: 'json',
          paramType: 'body'
        }
      ]
    };

    class Foo {

    }
    const controllerInstance = new Foo();
    const req = {
      body: JSON.stringify({ foo: 'bar' })
    };
    const res = {
      send: Sinon.spy()
    };

    const middlewareFn = expressMiddlewareFactory(restMethod, controllerInstance);
    await middlewareFn(req, res);
    // restMethod is called with arg from request
    assert.isTrue(controllerMethodStub.called);
    assert.deepEqual(controllerMethodStub.firstCall.args, [{ foo: 'bar' }]);

    // respond is sent with returned value
    assert.equal(res.send.firstCall.args[0], JSON.stringify('return-value'));
  });
});

describe('#initializeExpressApp()', () => {
  it('should populate Express Application with routes specified in the controller reflect metadata', () => {
    class Foo {

    }
    const restMetadata: IRestMetadata = {
      propKey1: {
        method: 'get',
        path: '/path-value',
        descriptor: {
          value: Sinon.spy()
        }
      }
    };
    Reflect.defineMetadata(restMetadataKey, restMetadata, Foo.prototype);
    const globalHexagonRegistry = getGlobalHexagonRegistry();
    globalHexagonRegistry.restControllers = [{ constructor: Foo }];
    const app = {
      get: Sinon.spy(),
      post: Sinon.spy(),
      put: Sinon.spy(),
      delete: Sinon.spy(),
      options: Sinon.spy()
    };
    // const expressMiddlewareFactoryOrg = adapterModule.__get__("expressMiddlewareFactory");
    // const expressMiddlewareFactoryStub = Sinon.stub();
    // const middlewareMock = () => {};
    // adapterModule.__set__('expressMiddlewareFactory', expressMiddlewareFactoryStub);
    // expressMiddlewareFactoryStub.returns(middlewareMock);

    initializeExpressApp(app as any);

    // test that the app methods are called
    assert.isTrue(app.get.called, "app['get'] is called");
    assert.deepEqual(app.get.firstCall.args[0], '/path-value');
    assert.isTrue(typeof app.get.firstCall.args[1] === 'function');
  });
});
