import { Psbt, Wallet as WalletI } from "./Abstract";
import { SatsConnectParticipant } from "../sats-connect/SatsConnectParticipant";

export abstract class SatsConnectWallet extends SatsConnectParticipant implements WalletI {
  async handleRequest(method: string, params: any[]): Promise<any> {
    switch (method) {
      case 'HAND_SHAKE': return true;
      case 'SIGN_PSBT': return this.sign(
        this.validate(params[0]),
      );
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }

  abstract sign(psbt: Psbt): Promise<Psbt>;

  private validate(psbtExpected: any): Psbt {
    if (
      !('signerAddresses' in psbtExpected
        || Array.isArray(psbtExpected.signerAddresses)
        || psbtExpected.signerAddresses.length !== 1
      ) ||
      !('payload' in psbtExpected)
    ) throw new Error('Invalid PSBT params');
    return {
      payload: psbtExpected.payload,
      signerAddresses: psbtExpected.signerAddresses[0],
      signatures: [/* FIXME */],
      signed: false,
    }
  }
}