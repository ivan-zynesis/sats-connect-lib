import { Psbt, Wallet as WalletI } from "./Abstract";
import { SatsConnectParticipant } from "../sats-connect/SatsConnectParticipant";

export class SatsConnectClient extends SatsConnectParticipant implements WalletI {
  async handleRequest(method: string, params: any[]): Promise<any> {
    switch (method) {
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }

  async sign(psbt: Psbt): Promise<Psbt> {
    return this.sendRequest('SIGN_PSBT', [psbt]);
  }
}