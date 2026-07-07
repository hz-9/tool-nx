import { SinglyLinkedList } from '../linked-list/singly.linked-list'
import { Stack } from './_base.stack'

/**
 *
 * @public
 *
 *  A stack implementation based on SinglyLinkedList.
 *
 *  一个基于数组实现的栈。
 *
 */
export class LinkedListStack<T> implements Stack<T> {
  private _linkedList: SinglyLinkedList<T>

  /**
   * Constructs a new linked-list-based stack.
   *
   * 构造一个新的基于链表的栈。
   */
  public constructor() {
    this._linkedList = new SinglyLinkedList<T>()
  }

  /**
   * The number of elements in the stack.
   *
   * 栈中元素的数量。
   */
  public get size(): number {
    return this._linkedList.size
  }

  /**
   * Whether the stack is empty.
   *
   * 栈是否为空。
   */
  public get isEmpty(): boolean {
    return this._linkedList.isEmpty
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
    this._linkedList.push(val)
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
    return this._linkedList.tail
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
    return this._linkedList.pop()
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
    this._linkedList.clear()
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

    let currentNode = this._linkedList.headNode
    while (currentNode) {
      str = currentNode === this._linkedList.headNode ? `${currentNode.val}` : `${currentNode.val},${str}`
      currentNode = currentNode.next
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
    let currentNode = this._linkedList.headNode
    while (currentNode) {
      array.unshift(currentNode.val)
      currentNode = currentNode.next
    }
    return array
  }
}
