import { MockWindow, Event, Window } from "../mock/Window";

export function InitMockDapp(window: Window) {
  const callback = () => {
    // void window.dispatchEvent('', {detail: {name}});
    setTimeout(callback, Math.random() * 10_000);
  }

  setTimeout(() => {
    callback();
  }, Math.random() * 10_000);

  window.addEventListener('network-change', async (event: Event): Promise<void> => {
    console.log('Event receveied', event);
  })
}
