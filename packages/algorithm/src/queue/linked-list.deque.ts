import { DoublyLinkedList } from '../linked-list/doubly.linked-list'
import { Deque } from './_base.deque'
import { LinkedListQueue } from './linked-list.queue'

/**
 *
 * @public
 *
 *  A deque implementation based on DoublyLinkedList.
 *
 *  一个基于链表的双向队列。
 *
 */
export class LinkedListDeque<T> extends LinkedListQueue<T> implements Deque<T> {
  declare protected _linkedList: DoublyLinkedList<T>

  /**
   * Constructs a new linked-list-based deque.
   *
   * 构造一个新的基于链表的双向队列。
   */
  public constructor() {
    super()
    this._linkedList = new DoublyLinkedList<T>()
  }

  /**
   * Add a new element to the front of the queue.
   *
   * 在队列头部添加一个新元素。
   *
   * Time complexity: O(1)
   *
   * Space complexity: O(1)
   *
   * @param value - The element to be added.
   */
  public unshift(value: T): void {
    this._linkedList.unshift(value)
  }

  /**
   * Remove and return the element at the back of the queue.
   *
   * 返回队尾部的元素，并从队列内移除。
   *
   * Time complexity: O(1)
   *
   * Space complexity: O(1)
   *
   * @returns The element at the back of the queue, or undefined if the queue is empty.
   */
  public pop(): T | undefined {
    return this._linkedList.pop()
  }

  /**
   * Return the element at the front of the queue without removing it.
   *
   * 返回队列头部的元素，并不移除。
   *
   * Time complexity: O(1)
   *
   * Space complexity: O(1)
   *
   * @returns The element at the front of the queue, or undefined if the queue is empty.
   */
  public peekFront(): T | undefined {
    return this.first
  }

  /**
   * Return the element at the back of the queue without removing it.
   *
   * 返回队列尾部的元素，并不移除。
   *
   * Time complexity: O(1)
   *
   * Space complexity: O(1)
   *
   * @returns The element at the back of the queue, or undefined if the queue is empty.
   */
  public peekBack(): T | undefined {
    return this.last
  }
}
