export interface Psbt {
  signerAddresses: string[];
  signatures: string[];
  signed: boolean;
  finalize(): string; // assumed serialized and broadcast ready
}

export interface Wallet {
  connect(address: string)
  sign(psbt: Psbt): Psbt;

}
