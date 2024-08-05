import { SatsConnect } from "../sats-connect/SatsConnect";
import { MockPubSub } from "../../mock/PubSub";
import { SatsConnectParticipant } from "../sats-connect/SatsConnectParticipant";
import { SatsConnectClient } from "./SatsConnectClient";
import { SatsConnectWallet } from "./SatsConnectWallet";
import { Psbt, Wallet } from "./Abstract";

const window = new MockPubSub();

class MockWallet extends SatsConnectWallet {
  async sign(psbt: Psbt): Promise<Psbt> {
    return {
      ...psbt,
      signatures: [`Signed(${psbt.payload})`],
      signed: true,
    };
  }
}

describe('Wallet', () => {
  let satsConnect: SatsConnect;
  let consumer: Wallet;

  // Given 2 participants connected
  beforeAll(() => {
    satsConnect = new SatsConnect(window);
    const client = new SatsConnectClient(satsConnect);
    SatsConnectParticipant.connect(satsConnect, client);
    consumer = client;

    const wallet = new MockWallet(satsConnect);
    SatsConnectParticipant.connect(satsConnect, wallet);
  });

  it('"Consumer" should be able to consume "Provider"\'s "sign" implementation', async () => {
    const signed = await consumer.sign({
      payload: 'foo',
      signerAddresses: ['addressToPerformSigning'],
      signatures: [],
      signed: false,
    });

    expect(signed).toStrictEqual({
      payload: 'foo',
      signerAddresses: ['addressToPerformSigning'],
      signatures: ['Signed(foo)'],
      signed: true,
    })
  });
});
