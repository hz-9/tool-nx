import { LinkedList, LinkedListNode } from './_base.linked-list'

/**
 *
 * @public
 *
 *  Singly Linked List Node Class
 *
 *  单向链表节点
 *
 */
export class SinglyLinkedListNode<T> extends LinkedListNode<T> {}

/**
 *
 * @public
 *
 *  Singly Linked List Class
 *
 *  单向链表
 *
 */
export class SinglyLinkedList<T> extends LinkedList<T, SinglyLinkedListNode<T>> {
  /**
   * Add a new element to the end of the linked list.
   *
   * 在链尾添加一个新元素。
   *
   * Time Complexity: O(1)
   *
   * Space Complexity: O(1)
   *
   * @param value - The element to be added.
   *
   * @returns Whether the addition was successful.
   */
  public push(value: T): boolean {
    const node = new SinglyLinkedListNode(value)

    if (!this._tailNode) {
      this._headNode = node
      this._tailNode = node
    } else {
      this._tailNode.next = node
      this._tailNode = node
    }

    this._size += 1

    return true
  }

  /**
   * Remove a node from the end of the linked list and return it.
   *
   * 在链尾删除一个节点，并返回该节点。
   *
   * Time Complexity: O(n) - Must traverse to the penultimate node.
   *
   * Space Complexity: O(1)
   *
   * @returns The removed node, or undefined if the list is empty.
   */
  public popNode(): SinglyLinkedListNode<T> | undefined {
    if (!this._tailNode || !this._headNode) return undefined

    // eslint-disable-next-line no-undef-init
    let temp: SinglyLinkedListNode<T> | undefined = undefined
    let current: SinglyLinkedListNode<T> = this._headNode

    if (!current.next) {
      temp = this._headNode
      this._headNode = undefined
      this._tailNode = undefined
    } else {
      while (current.next!.next) {
        current = current.next!
      }

      temp = current.next
      current.next = undefined
      this._tailNode = current
    }

    this._size -= 1
    return temp
  }

  /**
   * Add a new element to the beginning of the linked list.
   *
   * 向链头添加一个新元素。
   *
   * Time Complexity: O(1)
   *
   * Space Complexity: O(1)
   *
   * @param value - The element to be added.
   *
   * @returns Whether the addition was successful.
   */
  public unshift(value: T): boolean {
    const node = new SinglyLinkedListNode(value)

    if (!this._headNode) {
      this._headNode = node
      this._tailNode = node
    } else {
      node.next = this._headNode
      this._headNode = node
    }

    this._size += 1

    return true
  }

  /**
   * Remove a node from the beginning of the linked list and return it.
   *
   * 在链头删除一个节点，并返回该节点。
   *
   * Time Complexity: O(1)
   *
   * Space Complexity: O(1)
   *
   * @returns The removed node, or undefined if the list is empty.
   */
  public shiftNode(): SinglyLinkedListNode<T> | undefined {
    if (!this._tailNode || !this._headNode) return undefined

    const temp: SinglyLinkedListNode<T> | undefined = this._headNode

    if (!temp.next) {
      this._headNode = undefined
      this._tailNode = undefined
    } else {
      this._headNode = temp.next
    }

    this._size -= 1
    return temp
  }

  /**
   * Add a new element at a specific position in the linked list.
   *
   * 在链表某个位置添加元素。
   *
   * Time Complexity: O(n)
   *
   * Space Complexity: O(1)
   *
   * @param index - The position to add at.
   * @param value - The element to be added.
   *
   * @returns Whether the addition was successful.
   */
  public addAt(index: number, value: T): boolean {
    if (index < 0 || index > this.size) return false

    if (this.size === 0) {
      this.push(value)
      return true
    }

    if (index === 0) {
      this.unshift(value)
      return true
    }

    /**
     * If `index` is an illegal value, false is already returned above
     */
    const prevNode = this.getNodeAt(index - 1)!
    // if (!prevNode) return false

    const node = new SinglyLinkedListNode<T>(value)
    node.next = prevNode.next

    prevNode.next = node
    this._size += 1

    return true
  }

  /**
   * Remove a node at a specific position in the linked list.
   *
   * 删除链表某个位置的节点。
   *
   * Time Complexity: O(n)
   *
   * Space Complexity: O(1)
   *
   * @param index - The position to remove.
   *
   * @returns Whether the removal was successful.
   */
  public removeAt(index: number): boolean {
    if (index < 0 || index > this.size) return false

    if (index === 0) {
      this.shiftNode()
      return true
    }

    if (index === this.size - 1) {
      this.popNode()
      return true
    }

    /**
     * If `index` is an illegal value, false is already returned above
     */
    const prevNode = this.getNodeAt(index - 1)!
    // if (!prevNode) return false

    prevNode.next = prevNode.next?.next

    this._size -= 1

    return true
  }

  /**
   * Remove a specific element from the linked list.
   *
   * 删除某个元素。
   *
   * Time Complexity: O(n)
   *
   * Space Complexity: O(1)
   *
   * @param value - The element to remove.
   *
   * @returns Whether the removal was successful.
   */
  public remove(value: T): boolean {
    if (this._equalsFn(this.head, value)) {
      this.shiftNode()
      return true
    }

    if (this._equalsFn(this.tail, value)) {
      this.popNode()
      return true
    }

    let prev = this._headNode

    while (prev && prev.next) {
      if (this._equalsFn(prev.next.val, value)) {
        const beDeleted = prev.next
        prev.next = prev.next.next
        beDeleted.next = undefined
        this._size -= 1
        return true
      }

      prev = prev.next
    }

    return false
  }
}
