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
  let serverParticipantId: string;

  // Given 2 participants connected
  beforeAll(() => {
    satsConnect = new SatsConnect(window);
    const client = new MockParticipant(satsConnect);
    const connected = SatsConnectParticipant.connect(satsConnect, client);
    serverParticipantId = connected.myConnectedId
  });

  it('should be able to do an RPC call to connected any connected participant (wallet provider)', async () => {
    const result = await satsConnect.call('third party', 'HELLO', ['p1', 'p2']);
    expect(result).toStrictEqual('Successfully executed method: HELLO, params: [p1,p2]')
  });

  it('Should timeout, when there is no participant is responding RPC request', async () => {
    await expect(
      satsConnect.call(serverParticipantId, 'HELLO', ['p1', 'p2']),
    ).rejects.toThrow('Timeout');
  });
});
