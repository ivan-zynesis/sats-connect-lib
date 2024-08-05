# Assessment

### Provided Context
> Xverse maintains an SDK which enables Bitcoin Dapp developers to easily integrate and communicate with the Xverse wallet.

### Interpreted Requirement / Criteria
It is to build a `walletconnect` or `sats-connect` like communication
tool and the essentially provides one participant SDK consumer to send request in synchronous or asynchronous manner
to another participant in the established `connection` (or possible a network).

As EIP1193 is mentioned in the original doc, the communication is expected to be done similar to JSON RPC call.
The communication medium should be abstracted, it does not really matter
if the RPC call is done over internet or within browser `window` as long as it works as a Event pub/sub interface. 

### Dependencies
This project is attempted with minimum dependencies as configuring pipelines for build, test purposes
will easily cost more time than the actual implementation. `pnpm` is used as my default package manager
in my machine thus the `pnpm-lock.yaml` file found, but it is probably remain working with just `npm` and `node` installed in the host machine.

Clone the project and
```shell
pnpm install
```
Should be sufficient to setup everything needed.
PS: pardon me for not configuring the .gitignore properly

### Test
The testing is written to use `jest`, a test script is configured to run every `.spec.ts` for now.
```shell
pnpm run test
```

### Run
To see some actions

```shell
pnpm build
pnpm start
```

A `main` script will be found in `/src/apps` is basically a demonstration on requested implementation.
It starts by starting two mock dapps (a wallet, and another wallet consumer).
Each dapp complete their initialization as wallet and wallet consumer correspondingly.

After the initial setup, the wallet consumer is requesting to the wallet to sign a PSBT (mocked)
on one second interval.

## Structure and Some Thought Process
The main implementation of this project includes
- `SatsConnect` as very fundamental implementation
- `SatsConnectWallet` and `SatsConnectClient` are demonstrating on how to build on top of provided `SatsConnect`

`SatsConnect` is designed to be a bridge between the provider and client, communication could be bi-directional.

```typescript
interface Foo {
  bar(): Promise<Bar>;
}

class SatsConnectWallet extends SatsConnectParticipant implements Foo {
  // handleRequest should call bar()
  async bar() {
    return new Bar();
  }
}

class SatsConnectClient extends SatsConnectParticipant implements Foo {
  async bar() {
    return this.sendRequest('bar');
  }
}
```
The implementation now is using the mocked `PubSub` where no serialization and deserialization are needed.
The interface shall be refined with data type constraints to ensure only simple data object and always serializable are passed as RPC params. 
 
