import { Compare } from '../_base'
import { Heap } from './_base.heap'

/**
 * @public
 *
 *  Max Heap Class
 *
 *  最大堆
 *
 */
export class MaxHeap<T> extends Heap<T> {
  /**
   * Perform the sift-up operation for a max heap.
   *
   * 最大堆的上移操作。
   *
   * Time complexity: O(log n)
   *
   * Space complexity: O(1)
   *
   * @param index - The index of the element to be moved.
   */
  public siftUp(index: number): void {
    const parent = this.getParentIndex(index)

    if (parent !== undefined && this._compareFn(this._list[parent], this._list[index]) === Compare.LESS_THAN) {
      this.swap(parent, index)

      this.siftUp(parent)
    }
  }

  /**
   * Perform the sift-down operation for a max heap.
   *
   * 最大堆的下移操作。
   *
   * Time complexity: O(log n)
   *
   * Space complexity: O(1)
   *
   * @param index - The index of the element to be moved.
   */
  public siftDown(index: number): void {
    let i: number = index

    const left = this.getLeftIndex(index)
    const right = this.getRightIndex(index)
    const size = this._size

    if (left < size && this._compareFn(this._list[i], this._list[left]) === Compare.LESS_THAN) {
      i = left
    }

    if (right < size && this._compareFn(this._list[i], this._list[right]) === Compare.LESS_THAN) {
      i = right
    }

    if (i !== index) {
      this.swap(i, index)
      this.siftDown(i)
    }
  }
}
