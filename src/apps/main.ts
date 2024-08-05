import { InitMockBitcoinWallet } from "./wallet";
import { MockWindow } from "../mock/Window";
import { InitMockDapp } from "./dapp";

const window = new MockWindow();

InitMockBitcoinWallet(window);
InitMockDapp(window);
