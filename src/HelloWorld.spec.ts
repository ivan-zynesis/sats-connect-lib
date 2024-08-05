import { HelloWorld } from "./HelloWorld";

describe('HelloWorld', () => {
  it('should return', () => {
    expect(HelloWorld()).toStrictEqual('HelloWorld!');
  });
});
