import { SatsConnect, SatsConnectCallEvent } from "./SatsConnect";

export abstract class SatsConnectParticipant {
  private myConnectedId: string;

  constructor(private readonly satsConnect: SatsConnect) {}

  static connect<Participant extends SatsConnectParticipant>(
    satsConnect: SatsConnect, participant: Participant,
  ): Participant {
    const id = satsConnect.connect(participant.listen.bind(participant));
    participant.myConnectedId = id;
    return participant;
  }

  abstract handleRequest(method: string, params: any[]): Promise<any>;

  async sendRequest(method: string, params: any[]): Promise<any> {
    if (!this.myConnectedId) {
      throw new Error('Not connected');
    }

    return this.satsConnect.call(this.myConnectedId, method, params);
  }

  private async listen(event: SatsConnectCallEvent): Promise<void> {
    try {
      const data = await this.handleRequest(event.detail.method, event.detail.params);
      this.satsConnect.respond(event.detail.satsConnectCallId, true, data);
    } catch (e) {
      this.satsConnect.respond(event.detail.satsConnectCallId, false, e);
    }
  }
}