import { Window } from "../mock/Window";

export function InitMockBitcoinWallet(window: Window) {
  const callback = () => {
    const name = Math.random() < 0.5 ? "mainnet" : "testnet";
    void window.dispatchEvent('network-change', {detail: {name}});
    setTimeout(callback, Math.random() * 10_000);
  }

  setTimeout(() => {
    callback();
  }, Math.random() * 10_000);
}
