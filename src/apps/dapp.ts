import { Event, Window } from "../mock/Window";
import { SatsConnectClient } from "../package/wallet/SatsConnectClient";
import { SatsConnect } from "../package/sats-connect/SatsConnect";

export function InitMockDapp(window: Window) {
  const satsConnect = new SatsConnect(window);

  window.addEventListener('network-change', async (event: Event): Promise<void> => {
    let client = new SatsConnectClient(satsConnect);

    const signed = await client.sign({
      payload: '(to be signed)',
      signatures: [],
      signed: false,
      signerAddresses: ['TODO'],
    });
    console.log('Signing result')
    console.log(signed)
  })
}
