import { InitMockBitcoinWallet } from "./wallet";
import { MockPubSub } from "../mock/PubSub";
import { InitMockDapp } from "./dapp";

const window = new MockPubSub();

InitMockBitcoinWallet(window);
InitMockDapp(window);
