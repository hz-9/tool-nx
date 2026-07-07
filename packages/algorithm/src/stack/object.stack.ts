import { Stack } from './_base.stack'

/**
 *
 * @public
 *
 *  A stack implementation based on object.
 *
 *  一个基于对象实现的栈。
 *
 */
export class ObjectStack<T> implements Stack<T> {
  private _items: Record<number, T>

  private _size: number

  /**
   * Constructs a new object-based stack.
   *
   * 构造一个新的基于对象的栈。
   */
  public constructor() {
    this._items = {}
    this._size = 0
  }

  /**
   * The number of elements in the stack.
   *
   * 栈中元素的数量。
   */
  public get size(): number {
    return this._size
  }

  /**
   * Whether the stack is empty.
   *
   * 栈是否为空。
   */
  public get isEmpty(): boolean {
    return this.size === 0
  }

  /**
   * Adds a new element to the top of the stack.
   *
   * 在栈顶添加一个新元素。
   *
   * Time complexity: O(1)
   *
   * Space complexity: O(1)
   *
   * @param val - The element to be added.
   */
  public push(val: T): void {
    this._items[this._size] = val
    this._size += 1
  }

  /**
   * Returns the top element of the stack without removing it.
   *
   * 返回栈顶的元素，但不从栈内移除。
   *
   * Time complexity: O(1)
   *
   * Space complexity: O(1)
   *
   * @returns The top element of the stack, or undefined if the stack is empty.
   */
  public peek(): T | undefined {
    return this._items[this._size - 1]
  }

  /**
   * Returns the top element of the stack and removes it from the stack.
   *
   * 返回栈顶的元素，并从栈内移除。
   *
   * Time complexity: O(1)
   *
   * Space complexity: O(1)
   *
   * @returns The top element of the stack, or undefined if the stack is empty.
   */
  public pop(): T | undefined {
    const a = this._items[this._size - 1]
    if (this._size > 0) this._size -= 1
    return a
  }

  /**
   * Clear the stack.
   *
   * 清空栈。
   *
   * Time complexity: O(1)
   *
   * Space complexity: O(1)
   */
  public clear(): void {
    this._items = {}
    this._size = 0
  }

  /**
   * Returns a string representation of the stack.
   *
   * 返回栈的字符串表示。
   *
   * Time complexity: O(n)
   *
   * Space complexity: O(n)
   *
   * @returns The string representation.
   */
  public toString(): string {
    let str: string = ''
    let i = this._size - 1
    while (i >= 0) {
      str = i === this._size - 1 ? `${this._items[i]}` : `${str},${this._items[i]}`
      i -= 1
    }
    return str
  }

  /**
   * Returns an array representation of the stack.
   *
   * 返回栈的数组表示。
   *
   * Time complexity: O(n)
   *
   * Space complexity: O(n)
   *
   * @returns The array representation.
   */
  public toArray(): T[] {
    const array: T[] = []
    let i = this._size - 1
    while (i >= 0) {
      array.push(this._items[i])
      i -= 1
    }
    return array
  }
}
