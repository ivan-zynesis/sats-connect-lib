import { randomUUID } from 'node:crypto';
import { Window, Event } from "../../mock/Window";

export interface SatsConnectCallEvent extends Event {
  name: 'sats-connect-rpc-call';
  // simplified way to identify response related to this call
  detail: {
    callerParticipantId: string;
    satsConnectCallId: string;
    method: string;
    params: any[];
  };
}

export interface SatsConnectRespondEvent extends Event {
  name: 'sats-connect-rpc-respond';
  detail: {
    satsConnectCallId: string;
    success: boolean;
    data: any;
  };
}

type RequestListener = (call: SatsConnectCallEvent) => Promise<void>;

export class SatsConnect {
  private readonly asyncReturns: Record<string, {
    resolve: (data: any) => void;
    reject: (error: Error) => void;
  }>;
  private readonly participants: Record<string, RequestListener>;

  constructor(
    // we can consider for other comms later, eg over a remote server
    private readonly window: Window,
  ) {
    this.asyncReturns = {};
    this.participants = {};
    window.addEventListener('sats-connect-rpc-call', this.requestHandling.bind(this));
    window.addEventListener('sats-connect-rpc-respond', this.responseHandling.bind(this));
  }

  connect(participant: RequestListener): string {
    // FIXME: participant prevent dupe
    const id = randomUUID();
    this.participants[id] = participant;
    return id;
    // TODO: handle disconnect
  }

  async call(callerParticipantId: string, method: string, params: any[]): Promise<any> {
    const callId = randomUUID();

    const callEvent: SatsConnectCallEvent['detail'] = {
      satsConnectCallId: callId,
      callerParticipantId,
      method,
      params,
    };

    // register listener + firing call
    const delayed = () => {
      void this.window.dispatchEvent('sats-connect-rpc-call', callEvent);
    }
    const promise = new Promise(((resolve, reject) => {
      this.asyncReturns[callId] = { resolve, reject };

      setTimeout(delayed, 100);
      setTimeout(() => {
        reject();
        delete this.asyncReturns[callId];
      }, 100_000);
    }));

    // dispatch "rpc call"


    return promise;
  }

  respond(
    id: SatsConnectRespondEvent['detail']['satsConnectCallId'],
    status: SatsConnectRespondEvent['detail']['success'],
    data: SatsConnectRespondEvent['detail']['data']
  ): void {
    void this.window.dispatchEvent('sats-connect-rpc-respond', {
      satsConnectCallId: id,
      success: status,
      data,
    });
  }

  private async requestHandling(event: Event): Promise<void> {
    if (event.name !== 'sats-connect-rpc-call') {
      return;
    }

    const response = event as SatsConnectCallEvent;

    await Promise.all(
      Object.entries(this.participants)
        .filter(([k]) => k !== response.detail.callerParticipantId)
        .map(([, listener]) => listener(response))
    );
  }

  private async responseHandling(event: Event): Promise<void> {
    if (event.name !== 'sats-connect-rpc-respond') {
      return;
    }

    const response = event as SatsConnectRespondEvent;
    const awaiting = this.asyncReturns[response.detail.satsConnectCallId];
    if (awaiting) {
      if (response.detail.success) {
        awaiting.resolve(response.detail.data);
      } else {
        awaiting.reject(response.detail.data);
      }

      delete this.asyncReturns[response.detail.satsConnectCallId];
    }
  }
}