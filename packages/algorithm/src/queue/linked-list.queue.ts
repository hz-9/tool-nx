import { SinglyLinkedList } from '../linked-list/singly.linked-list'
import { Queue } from './_base.queue'

/**
 *
 * @public
 *
 *  A queue implementation based on SinglyLinkedList.
 *
 *  一个基于链表的单向队列。
 *
 */
export class LinkedListQueue<T> implements Queue<T> {
  protected _linkedList: SinglyLinkedList<T>

  /**
   * Constructs a new linked-list-based queue.
   *
   * 构造一个新的基于链表的队列。
   */
  public constructor() {
    this._linkedList = new SinglyLinkedList<T>()
  }

  /**
   * The number of elements in the queue.
   *
   * 队列中元素的数量。
   */
  public get size(): number {
    return this._linkedList.size
  }

  /**
   * Whether the queue is empty.
   *
   * 队列是否为空。
   */
  public get isEmpty(): boolean {
    return this._linkedList.isEmpty
  }

  /**
   * The first element in the queue.
   *
   * 队列第一个元素。
   */
  public get first(): T | undefined {
    return this._linkedList.head
  }

  /**
   * The last element in the queue.
   *
   * 队列最后一个元素。
   */
  public get last(): T | undefined {
    return this._linkedList.tail
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
    this._linkedList.push(value)
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
    return this._linkedList.shift()
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
    this._linkedList.clear()
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

    let currentNode = this._linkedList.headNode
    while (currentNode) {
      str = currentNode === this._linkedList.headNode ? `${currentNode.val}` : `${str},${currentNode.val}`
      currentNode = currentNode.next
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
    let currentNode = this._linkedList.headNode
    while (currentNode) {
      array.push(currentNode.val)
      currentNode = currentNode.next
    }
    return array
  }
}
