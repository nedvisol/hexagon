/* eslint @typescript-eslint/no-extraneous-class: "off" */
import { assert } from 'chai';
import { getGlobalHexagonRegistry, getGlobalRestMetadataKey, IHexagonRegistry } from '../src/core';

describe('#getGlobalRestMetadataKey', () => {
  it('should return a symbol', () => {
    const actual = getGlobalRestMetadataKey();
    assert.isTrue(typeof actual === 'symbol');
  });
});

describe('#getGlobalHexagonRegistry', () => {
  it('should return an empty registry if global is not defined', () => {
    const actual = getGlobalHexagonRegistry();
    assert.deepEqual(actual, { restControllers: [] });
  });
  it('should return a registry from global', () => {
    const mockRegistry: IHexagonRegistry = {
      restControllers: [class Foo {}]
    };
    (globalThis as any)._HexagonRegistry = mockRegistry;
    const actual = getGlobalHexagonRegistry();
    assert.deepEqual(actual, mockRegistry);
  });
});
