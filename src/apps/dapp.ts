import { Event, PubSub } from "../mock/PubSub";
import { SatsConnectClient } from "../package/wallet/SatsConnectClient";
import { SatsConnect } from "../package/sats-connect/SatsConnect";
import { SatsConnectParticipant } from "../package/sats-connect/SatsConnectParticipant";

export function InitMockDapp(window: PubSub) {
  const satsConnect = new SatsConnect(window);

  const callback = async () => {
    const signed = await client.sign({
      payload: `Random payload ${Math.random()} to be signed`,
      signatures: [],
      signed: false,
      signerAddresses: ['TODO'],
    });
    console.log('Signing result');
    console.log(signed);

    setTimeout(callback, 1000);
  };

  let client: SatsConnectClient;
  window.addEventListener('network-change', async (event: Event): Promise<void> => {
    console.log('Mock dapp received event')
    client = new SatsConnectClient(satsConnect);
    SatsConnectParticipant.connect(satsConnect, client);

    setTimeout(async () => {
      callback();
    }, 1000);
  })
}
