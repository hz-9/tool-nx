import { Queue } from './_base.queue'

/**
 *
 * @public
 *
 *  A queue implementation based on array.
 *
 *  一个基于数组的单向队列。
 *
 */
export class ArrayQueue<T> implements Queue<T> {
  protected _list: Array<T>

  /**
   * Constructs a new array-based queue.
   *
   * 构造一个新的基于数组的队列。
   */
  public constructor() {
    this._list = []
  }

  /**
   * The number of elements in the queue.
   *
   * 队列中元素的数量。
   */
  public get size(): number {
    return this._list.length
  }

  /**
   * Whether the queue is empty.
   *
   * 队列是否为空。
   */
  public get isEmpty(): boolean {
    return this._list.length === 0
  }

  /**
   * The first element in the queue.
   *
   * 队列第一个元素。
   */
  public get first(): T | undefined {
    return this._list[0]
  }

  /**
   * The last element in the queue.
   *
   * 队列最后一个元素。
   */
  public get last(): T | undefined {
    return this._list[this._list.length - 1]
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
    this._list.push(value)
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
   * Time Complexity: O(n)
   *
   * Space Complexity: O(1)
   *
   * @returns The first element in the queue, or undefined if the queue is empty.
   */
  public shift(): T | undefined {
    return this._list.shift()
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
    this._list = []
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
    this._list.forEach((item, index) => {
      str = index === 0 ? `${item}` : `${str},${item}`
    })
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
    this._list.forEach((item) => {
      array.push(item)
    })
    return array
  }
}
