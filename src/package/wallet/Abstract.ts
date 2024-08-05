export interface Psbt {
  payload: string;
  signerAddresses: string[];
  signatures: string[];
  signed: boolean;
}

export interface Wallet {
  sign(psbt: Psbt): Promise<Psbt>;
}
