import { Queue } from './_base.queue'

/**
 *
 * @public
 *
 *  A queue implementation based on object.
 *
 *  一个基于对象的单向队列。
 *
 */
export class ObjectQueue<T> implements Queue<T> {
  protected _items: Record<number, T>

  protected _size: number

  /**
   * 第一个元素，未知
   */
  protected _flag: number

  /**
   * Constructs a new object-based queue.
   *
   * 构造一个新的基于对象的队列。
   */
  public constructor() {
    this._items = []

    this._size = 0

    this._flag = 0
  }

  /**
   * The number of elements in the queue.
   *
   * 队列中元素的数量。
   */
  public get size(): number {
    return this._size
  }

  /**
   * Whether the queue is empty.
   *
   * 队列是否为空。
   */
  public get isEmpty(): boolean {
    return this._size === 0
  }

  /**
   * The first element in the queue.
   *
   * 队列第一个元素。
   */
  public get first(): T | undefined {
    return this._items[this._flag]
  }

  /**
   * The last element in the queue.
   *
   * 队列最后一个元素。
   */
  public get last(): T | undefined {
    return this._items[this._flag + this._size - 1]
  }

  /**
   * Add a new element to the end of the queue.
   *
   * 在队列尾部添加一个新元素。
   *
   * Time Complexity: O(1)
   *
   * Space Complexity: O(1)
   *
   * @param value - The element to be added.
   */
  public push(value: T): void {
    this._items[this._flag + this._size] = value
    this._size += 1
  }

  /**
   * Return the first element in the queue without removing it.
   *
   * 返回队列头部的元素，并不移除。
   *
   * Time Complexity: O(1)
   *
   * Space Complexity: O(1)
   *
   * @returns The first element in the queue, or undefined if the queue is empty.
   */
  public peek(): T | undefined {
    return this.first
  }

  /**
   * Return the first element in the queue and remove it from the queue.
   *
   * 返回队列头部的元素，并从队列内移除。
   *
   * Time Complexity: O(1)
   *
   * Space Complexity: O(1)
   *
   * @returns The first element in the queue, or undefined if the queue is empty.
   */
  public shift(): T | undefined {
    const first = this._items[this._flag]
    delete this._items[this._flag]

    if (this._size > 0) this._size -= 1

    /**
     * 在队列中，先入先出过程中， _flag 会不断地向右移动，当队列为空时，_flag 进行重置。
     */
    if (this.isEmpty) {
      this._flag = 0
    } else {
      this._flag += 1
    }

    return first
  }

  /**
   * Clear the queue.
   *
   * 清空队列。
   *
   * Time Complexity: O(1)
   *
   * Space Complexity: O(1)
   */
  public clear(): void {
    this._items = []

    this._size = 0

    this._flag = 0
  }

  /**
   * Returns a string representation of the queue.
   *
   * 返回队列的字符串表示。
   *
   * Time Complexity: O(n)
   *
   * Space Complexity: O(n)
   *
   * @returns The string representation.
   */
  public toString(): string {
    let str: string = ''
    let i = 0
    while (i < this._size) {
      str = i === 0 ? `${this._items[this._flag + i]}` : `${str},${this._items[this._flag + i]}`
      i += 1
    }
    return str
  }

  /**
   * Returns an array representation of the queue.
   *
   * 返回队列的数组表示。
   *
   * Time Complexity: O(n)
   *
   * Space Complexity: O(n)
   *
   * @returns The array representation.
   */
  public toArray(): T[] {
    const array: T[] = []
    let i = 0
    while (i < this._size) {
      array.push(this._items[this._flag + i])
      i += 1
    }
    return array
  }
}
