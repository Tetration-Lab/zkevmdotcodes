export class Stack<T> {
  public items: T[] = []

  push(item: T): void {
    this.items.push(item)
  }

  pop(): T {
    try {
      const item = this.peek()
      this.items.pop()
      return item
    } catch (e) {
      throw e
    }
  }

  peek(): T {
    return this.items[this.items.length - 1]
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }

  size(): number {
    return this.items.length
  }

  clear(): void {
    this.items = []
  }
}
