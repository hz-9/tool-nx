import { Deque } from './_base.deque'
import { ObjectQueue } from './object.queue'

/**
 *
 * @public
 *
 *  A deque implementation based on object.
 *
 *  一个基于对象的双向队列。
 *
 */
export class ObjectDeque<T> extends ObjectQueue<T> implements Deque<T> {
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
    if (!this.isEmpty) this._flag -= 1

    this._items[this._flag] = value
    this._size += 1
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
    const last = this._items[this._flag + this._size - 1]
    delete this._items[this._flag + this._size - 1]

    if (this._size > 0) this._size -= 1

    /**
     * 在队列中，先入先出过程中， _flag 会不断地向右移动，当队列为空时，_flag 进行重置。
     */
    if (this.isEmpty) {
      this._flag = 0
    }

    return last
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
