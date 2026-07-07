import { LinkedList, LinkedListNode } from './_base.linked-list'

/**
 *
 * @public
 *
 *  Doubly Linked List Node Class
 *
 *  双向链表节点
 *
 */
export class DoublyLinkedListNode<T> extends LinkedListNode<T> {
  /**
   * Pointer to the previous node in the doubly linked list.
   *
   * 指向双向链表中上一个节点的指针。
   */
  public prev: DoublyLinkedListNode<T> | undefined

  /**
   * Pointer to the next node in the doubly linked list.
   *
   * 指向双向链表中下一个节点的指针。
   */
  public next: DoublyLinkedListNode<T> | undefined

  /**
   * Constructs a new doubly linked list node.
   *
   * 构造一个新的双向链表节点。
   *
   * @param val - The node value.
   */
  public constructor(val: T) {
    super(val)

    this.prev = undefined
    this.next = undefined
  }
}

/**
 *
 * @public
 *
 *  Doubly Linked List Class
 *
 *  双向链表
 *
 */
export class DoublyLinkedList<T> extends LinkedList<T, DoublyLinkedListNode<T>> {
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
    const node = new DoublyLinkedListNode(value)

    if (!this._tailNode) {
      this._headNode = node
      this._tailNode = node
    } else {
      this._tailNode.next = node
      node.prev = this._tailNode

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
   * Time Complexity: O(1)
   *
   * Space Complexity: O(1)
   *
   * @returns The removed node, or undefined if the list is empty.
   */
  public popNode(): DoublyLinkedListNode<T> | undefined {
    if (!this._tailNode || !this._headNode) return undefined

    const temp: DoublyLinkedListNode<T> = this._tailNode

    if (!temp.prev) {
      this._headNode = undefined
      this._tailNode = undefined
    } else {
      this._tailNode = temp.prev

      this._tailNode.next = undefined
    }

    temp.prev = undefined
    temp.next = undefined

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
    const node = new DoublyLinkedListNode<T>(value)

    if (!this._headNode) {
      this._headNode = node
      this._tailNode = node
    } else {
      node.next = this._headNode
      this._headNode.prev = node

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
  public shiftNode(): DoublyLinkedListNode<T> | undefined {
    if (!this._tailNode || !this._headNode) return undefined

    const temp: DoublyLinkedListNode<T> = this._headNode

    if (!temp.next) {
      this._headNode = undefined
      this._tailNode = undefined
    } else {
      this._headNode = temp.next
      this._headNode.prev = undefined
    }

    temp.prev = undefined
    temp.next = undefined

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

    const node = new DoublyLinkedListNode<T>(value)
    node.next = prevNode.next
    node.prev = prevNode

    prevNode.next = node
    if (node.next) node.next.prev = node

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
    const currentNode = this.getNodeAt(index)!
    // if (!currentNode) return false

    if (currentNode.prev) currentNode.prev.next = currentNode.next
    if (currentNode.next) currentNode.next.prev = currentNode.prev

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

    const currentNode = this.getNode(value)
    if (!currentNode) return false

    if (currentNode.prev) currentNode.prev.next = currentNode.next
    if (currentNode.next) currentNode.next.prev = currentNode.prev

    this._size -= 1
    return true
  }
}
