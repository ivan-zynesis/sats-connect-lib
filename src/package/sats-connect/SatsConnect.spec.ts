import { SatsConnect } from "./SatsConnect";
import { MockWindow } from "../../mock/Window";
import { SatsConnectParticipant } from "./SatsConnectParticipant";

const window = new MockWindow();

class MockParticipant extends SatsConnectParticipant {
  async handleRequest(method: string, params: any[]): Promise<any> {
    return `Successfully executed method: ${method}, params: [${params.join(',')}]`;
  }
}


describe('SatsConnect', () => {
  let satsConnect: SatsConnect;


  // Given 2 participants connected
  beforeAll(() => {
    satsConnect = new SatsConnect(window);
    SatsConnectParticipant.connect(satsConnect, MockParticipant);
  });

  it('should return', async () => {
    const result = await satsConnect.call('HELLO', ['p1', 'p2']);
    expect(result).toStrictEqual('Successfully executed method: HELLO, params: [p1,p2]')
  });
});
