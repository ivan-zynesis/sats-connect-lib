import { SatsConnect, SatsConnectCallEvent } from "./SatsConnect";

export abstract class SatsConnectParticipant {
  constructor(private readonly satsConnect: SatsConnect) {}

  static connect<Participant extends SatsConnectParticipant>(
    satsConnect: SatsConnect, P: new (c: SatsConnect) => Participant
  ): Participant {
    const participant = new P(satsConnect);
    satsConnect.connect(participant.listen.bind(participant));
    return participant;
  }

  abstract handleRequest(method: string, params: any[]): Promise<any>;

  private async listen(event: SatsConnectCallEvent): Promise<void> {
    try {
      const data = await this.handleRequest(event.detail.method, event.detail.params);
      this.satsConnect.respond(event.detail.satsConnectCallId, true, data);
    } catch (e) {
      this.satsConnect.respond(event.detail.satsConnectCallId, false, e);
    }
  }
}