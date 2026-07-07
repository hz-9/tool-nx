import { Compare, CompareFn, EqualsFn, defaultCompare, defaultEquals } from '../_base'
import { DoublyLinkedList } from './doubly.linked-list'

/**
 *
 * @public
 *
 *  Sorted Linked List Class
 *
 *  有序链表
 *
 */
export class SortedLinkedList<T> extends DoublyLinkedList<T> {
  protected readonly _compareFn: CompareFn<T>

  /**
   * Constructs a new sorted linked list.
   *
   * 构造一个新的有序链表。
   *
   * @param equalsFn - The equality comparison function.
   * @param compareFn - The comparison function used to determine the order of the elements.
   */
  public constructor(equalsFn: EqualsFn<T> = defaultEquals, compareFn: CompareFn<T> = defaultCompare) {
    super(equalsFn)
    this._compareFn = compareFn
  }

  /**
   * Add a new element to the end of the linked list.
   * Only elements greater than the current tail value can be appended.
   *
   * 在链尾添加一个新元素。
   * 只有大于当前尾部值的元素才能被追加。
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
    if (!this._tailNode) return super.push(value)

    const c = this._compareFn(this._tailNode.val, value)
    if (c === Compare.LESS_THAN) return super.push(value)
    return false
  }

  /**
   * Add a new element to the beginning of the linked list.
   * Only elements less than the current head value can be prepended.
   *
   * 向链头添加一个新元素。
   * 只有小于当前头部值的元素才能被插入。
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
    if (!this._headNode) return super.unshift(value)

    const c = this._compareFn(value, this._headNode.val)
    if (c === Compare.LESS_THAN) return super.unshift(value)
    return false
  }

  /**
   * Add a new element at a specific position in the linked list.
   * Only inserts if the value maintains sorted order.
   *
   * 在链表某个位置添加元素。
   * 只有当值保持排序顺序时才插入。
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

    if (!this._headNode) {
      this.push(value)
      return true
    }

    if (index === 0) {
      if (this._compareFn(value, this._headNode.val) === Compare.LESS_THAN) {
        this.unshift(value)
        return true
      }
      return false
    }

    /**
     * If `index` is an illegal value, false is already returned above
     */
    const prevNode = this.getNodeAt(index - 1)!
    // if (!prevNode) return false

    if (this._compareFn(prevNode.val, value) === Compare.LESS_THAN) {
      const nextNode = this.getNodeAt(index)

      if (nextNode) {
        if (this._compareFn(value, nextNode.val) === Compare.LESS_THAN) {
          return super.addAt(index, value)
        }
      } else {
        return super.addAt(index, value)
      }
    }

    return false
  }
}
