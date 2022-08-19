/* eslint @typescript-eslint/no-useless-constructor: "off", @typescript-eslint/no-extraneous-class: "off" */

import { assert } from 'chai';
import { getGlobalHexagonRegistry, IRestMetadata, restMetadataKey } from '../src/core';
import { RestBody, RestController, RestDeleteMapping, RestGetMapping, RestHeaderParam, RestOptionsMapping, RestPathParam, RestPostMapping, RestPutMapping, RestQueryParam } from '../src/decorators';

describe('#RestController', () => {
  it('should return a function that registers globally a controller on an initial call', () => {
    (global as any)._HexagonRegistry = undefined;
    const decorFn = RestController();
    assert.equal(typeof decorFn === 'function', true);
    class Foo {
      constructor () {}
    }
    decorFn(Foo);
    const globalHexagonRegistry = getGlobalHexagonRegistry();
    assert.deepEqual(globalHexagonRegistry.restControllers, [{ constructor: Foo }]);
  });

  it('should return a function that registers globally a controller on multiple calls', () => {
    (global as any)._HexagonRegistry = undefined;
    const decorFn = RestController();
    assert.equal(typeof decorFn === 'function', true);
    class Foo {
      constructor () {}
    }
    class Foo2 {
      constructor () {}
    }
    decorFn(Foo);
    decorFn(Foo2);
    const globalHexagonRegistry = getGlobalHexagonRegistry();
    assert.deepEqual(globalHexagonRegistry.restControllers, [{ constructor: Foo }, { constructor: Foo2 }]);
  });
});

describe('#RestGetMapping', () => {
  it('should return a function that registers a method mapping on the class reflection metadata', () => {
    const decorFn = RestGetMapping('path-value');
    assert.equal(typeof decorFn === 'function', true);
    class Foo {
      constructor () {}
    }
    const descriptor: PropertyDescriptor = {
      value: 'test'
    };
    decorFn(Foo, 'propkey1', descriptor);
    decorFn(Foo, 'propkey2', descriptor);

    const existingRestMetadata: IRestMetadata = Reflect.getOwnMetadata(restMetadataKey, Foo);
    // console.log(JSON.stringify(existingRestMetadata));
    assert.deepEqual(existingRestMetadata, { propkey1: { path: 'path-value', method: 'get', descriptor: { value: 'test' } }, propkey2: { path: 'path-value', method: 'get', descriptor: { value: 'test' } } });
  });
});

describe('#RestPostMapping', () => {
  it('should return a function that registers a method mapping on the class reflection metadata', () => {
    const decorFn = RestPostMapping('path-value');
    assert.equal(typeof decorFn === 'function', true);
    class Foo {
      constructor () {}
    }
    const descriptor: PropertyDescriptor = {
      value: 'test'
    };
    decorFn(Foo, 'propkey1', descriptor);
    decorFn(Foo, 'propkey2', descriptor);

    const existingRestMetadata: IRestMetadata = Reflect.getOwnMetadata(restMetadataKey, Foo);
    // console.log(JSON.stringify(existingRestMetadata));
    assert.deepEqual(existingRestMetadata, { propkey1: { path: 'path-value', method: 'post', descriptor: { value: 'test' } }, propkey2: { path: 'path-value', method: 'post', descriptor: { value: 'test' } } });
  });
});

describe('#RestPutMapping', () => {
  it('should return a function that registers a method mapping on the class reflection metadata', () => {
    const decorFn = RestPutMapping('path-value');
    assert.equal(typeof decorFn === 'function', true);
    class Foo {
      constructor () {}
    }
    const descriptor: PropertyDescriptor = {
      value: 'test'
    };
    decorFn(Foo, 'propkey1', descriptor);
    decorFn(Foo, 'propkey2', descriptor);

    const existingRestMetadata: IRestMetadata = Reflect.getOwnMetadata(restMetadataKey, Foo);
    // console.log(JSON.stringify(existingRestMetadata));
    assert.deepEqual(existingRestMetadata, { propkey1: { path: 'path-value', method: 'put', descriptor: { value: 'test' } }, propkey2: { path: 'path-value', method: 'put', descriptor: { value: 'test' } } });
  });
});

describe('#RestDeleteMapping', () => {
  it('should return a function that registers a method mapping on the class reflection metadata', () => {
    const decorFn = RestDeleteMapping('path-value');
    assert.equal(typeof decorFn === 'function', true);
    class Foo {
      constructor () {}
    }
    const descriptor: PropertyDescriptor = {
      value: 'test'
    };
    decorFn(Foo, 'propkey1', descriptor);
    decorFn(Foo, 'propkey2', descriptor);

    const existingRestMetadata: IRestMetadata = Reflect.getOwnMetadata(restMetadataKey, Foo);
    // console.log(JSON.stringify(existingRestMetadata));
    assert.deepEqual(existingRestMetadata, { propkey1: { path: 'path-value', method: 'delete', descriptor: { value: 'test' } }, propkey2: { path: 'path-value', method: 'delete', descriptor: { value: 'test' } } });
  });
});

describe('#RestOptionsMapping', () => {
  it('should return a function that registers a method mapping on the class reflection metadata', () => {
    const decorFn = RestOptionsMapping('path-value');
    assert.equal(typeof decorFn === 'function', true);
    class Foo {
      constructor () {}
    }
    const descriptor: PropertyDescriptor = {
      value: 'test'
    };
    decorFn(Foo, 'propkey1', descriptor);
    decorFn(Foo, 'propkey2', descriptor);

    const existingRestMetadata: IRestMetadata = Reflect.getOwnMetadata(restMetadataKey, Foo);
    // console.log(JSON.stringify(existingRestMetadata));
    assert.deepEqual(existingRestMetadata, { propkey1: { path: 'path-value', method: 'options', descriptor: { value: 'test' } }, propkey2: { path: 'path-value', method: 'options', descriptor: { value: 'test' } } });
  });
});

describe('#RestPathParam', () => {
  it('should return a function that registers a parameter mapping on the class reflection metadata', () => {
    const decorFn = RestPathParam('paramName-value');
    assert.equal(typeof decorFn === 'function', true);
    class Foo {
      constructor () {}
    }
    decorFn(Foo, 'propkey1', 0);
    decorFn(Foo, 'propkey1', 1);

    const existingRestMetadata = Reflect.getOwnMetadata(restMetadataKey, Foo);
    // console.log(JSON.stringify(existingRestMetadata));
    assert.deepEqual(existingRestMetadata, { propkey1: { parameters: [{ paramType: 'path', paramName: 'paramName-value' }, { paramType: 'path', paramName: 'paramName-value' }] } });
  });
});

describe('#RestQueryParam', () => {
  it('should return a function that registers a parameter mapping on the class reflection metadata', () => {
    const decorFn = RestQueryParam('paramName-value');
    assert.equal(typeof decorFn === 'function', true);
    class Foo {
      constructor () {}
    }
    decorFn(Foo, 'propkey1', 0);
    decorFn(Foo, 'propkey1', 1);

    const existingRestMetadata = Reflect.getOwnMetadata(restMetadataKey, Foo);
    // console.log(JSON.stringify(existingRestMetadata));
    assert.deepEqual(existingRestMetadata, { propkey1: { parameters: [{ paramType: 'querystring', paramName: 'paramName-value' }, { paramType: 'querystring', paramName: 'paramName-value' }] } });
  });
});

describe('#RestHeaderParam', () => {
  it('should return a function that registers a parameter mapping on the class reflection metadata', () => {
    const decorFn = RestHeaderParam('paramName-value');
    assert.equal(typeof decorFn === 'function', true);
    class Foo {
      constructor () {}
    }
    decorFn(Foo, 'propkey1', 0);
    decorFn(Foo, 'propkey1', 1);

    const existingRestMetadata = Reflect.getOwnMetadata(restMetadataKey, Foo);
    // console.log(JSON.stringify(existingRestMetadata));
    assert.deepEqual(existingRestMetadata, { propkey1: { parameters: [{ paramType: 'header', paramName: 'paramName-value' }, { paramType: 'header', paramName: 'paramName-value' }] } });
  });
});

describe('#RestBody', () => {
  it('should return a function that registers a parameter mapping on the class reflection metadata - raw', () => {
    const decorFn = RestBody();
    assert.equal(typeof decorFn === 'function', true);
    class Foo {
      constructor () {}
    }
    decorFn(Foo, 'propkey1', 0);
    decorFn(Foo, 'propkey1', 1);

    const existingRestMetadata = Reflect.getOwnMetadata(restMetadataKey, Foo);
    // console.log(JSON.stringify(existingRestMetadata));
    assert.deepEqual(existingRestMetadata, { propkey1: { parameters: [{ paramType: 'body', paramName: 'raw' }, { paramType: 'body', paramName: 'raw' }] } });
  });
  it('should return a function that registers a parameter mapping on the class reflection metadata - json', () => {
    const decorFn = RestBody({ encoding: 'json' });
    assert.equal(typeof decorFn === 'function', true);
    class Foo {
      constructor () {}
    }
    decorFn(Foo, 'propkey1', 0);
    decorFn(Foo, 'propkey1', 1);

    const existingRestMetadata = Reflect.getOwnMetadata(restMetadataKey, Foo);
    // console.log(JSON.stringify(existingRestMetadata));
    assert.deepEqual(existingRestMetadata, { propkey1: { parameters: [{ paramType: 'body', paramName: 'json' }, { paramType: 'body', paramName: 'json' }] } });
  });
});
