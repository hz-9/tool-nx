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

  public constructor() {
    super()
    this._linkedList = new DoublyLinkedList<T>()
  }

  public unshift(value: T): void {
    this._linkedList.unshift(value)
  }

  public pop(): T | undefined {
    return this._linkedList.pop()
  }

  public peekFront(): T | undefined {
    return this.first
  }

  public peekBack(): T | undefined {
    return this.last
  }
}
