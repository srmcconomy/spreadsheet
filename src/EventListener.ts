export class EventListener {
  private listeners = new Set<() => void>();

  add(listener: () => void) {
    this.listeners.add(listener);
  }
  remove(listener: () => void) {
    this.listeners.delete(listener);
  }
  emit() {
    this.listeners.forEach((listener) => listener());
  }
}
