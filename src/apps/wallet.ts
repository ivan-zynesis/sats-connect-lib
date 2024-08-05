import { Window } from "../mock/Window";
import { SatsConnectWallet } from "../package/wallet/SatsConnectWallet";
import { SatsConnect } from "../package/sats-connect/SatsConnect";
import { Psbt, Wallet } from "../package/wallet/Abstract";
import { SatsConnectParticipant } from "../package/sats-connect/SatsConnectParticipant";

class SomeonesWalletImplementation extends SatsConnectWallet {
  constructor(satsConnect: SatsConnect, private readonly network: string, private readonly pk: string) {
    super(satsConnect);
  }

  async sign(psbt: Psbt): Promise<Psbt> {
    return {
      payload: psbt.payload,
      signerAddresses: psbt.signerAddresses,
      signatures: [`${psbt.payload} signed by ${this.pk}`],
      signed: true,
    };
  }
}

export function InitMockBitcoinWallet(window: Window) {
  // mimic random user action on UI
  const callback = () => {
    const name = Math.random() < 0.5 ? "mainnet" : "testnet";
    void window.dispatchEvent('network-change', {detail: {name}});

    // FIXME: until disconnect implemented
    // setTimeout(callback, Math.random() * 10_000);
  }

  setTimeout(() => {
    callback();
  }, Math.random() * 10_000);

  const satsConnect = new SatsConnect(window);

  window.addEventListener('network-change', async (event) => {
    // FIXME: disconnect + reconnect

    console.log('wallet received event')
    const wallet = new SomeonesWalletImplementation(satsConnect, event.detail.name, mockGetPkFromPersistentStorage());
    SatsConnectParticipant.connect(satsConnect, wallet);
  });
}

function mockGetPkFromPersistentStorage() {
  return 'let say private key here';
}
