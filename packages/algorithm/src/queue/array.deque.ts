import { Deque } from './_base.deque'
import { ArrayQueue } from './array.queue'

/**
 *
 * @public
 *
 *  A deque implementation based on array.
 *
 *  一个基于数组的双向队列。
 *
 */
export class ArrayDeque<T> extends ArrayQueue<T> implements Deque<T> {
  /**
   * Add a new element to the front of the queue.
   *
   * 在队列头部添加一个新元素。
   *
   * Time complexity: O(n)
   *
   * Space complexity: O(1)
   *
   * @param value - The element to be added.
   */
  public unshift(value: T): void {
    this._list.unshift(value)
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
    return this._list.pop()
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
