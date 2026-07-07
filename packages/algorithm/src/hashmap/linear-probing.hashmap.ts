import { EMPTY_KEY_VALUE, KeyValue, kVEqualFn } from './_base.hashmap'
import { SimpleHashmap } from './simple.hashmap'

/**
 * @public
 *
 * A hashmap with linear probing.
 *
 * 一个使用线性探查的哈希表。
 */
export class LinearProbingHashmap<K, V> extends SimpleHashmap<K, V> {
  /**
   * Adds a key-value pair to the hash map using linear probing.
   *
   * 使用线性探查将键值对添加到哈希表中。
   *
   * Time complexity: O(1) average, O(n) worst case
   *
   * Space complexity: O(1)
   *
   * @param key - The key object.
   * @param value - The value information.
   *
   * @returns Whether the addition is successful.
   */
  public set(key: K, value: V): boolean {
    const keyStr: number = this._toHashCode(this._toKeyStr(key))

    let isUpdate = false

    let index = keyStr
    let g = this._items[index]
    while (g) {
      // is Empty Key Value, Set
      if (kVEqualFn(g, EMPTY_KEY_VALUE)) break

      // Equal Key, Update
      if (this._toKeyStr(key) === this._toKeyStr(g.key)) {
        isUpdate = true
        break
      }

      index += 1
      g = this._items[index]
    }

    this._items[index] = new KeyValue<K, V>(key, value)
    if (!isUpdate) this._size += 1
    return true
  }

  /**
   * Retrieves the value from the hash map based on the key using linear probing.
   *
   * 使用线性探查根据键从哈希表中获取值。
   *
   * Time complexity: O(1) average, O(n) worst case
   *
   * Space complexity: O(1)
   *
   * @param key - The key object.
   *
   * @returns The value object. Returns undefined if the key does not exist.
   */
  public get(key: K): V | undefined {
    const keyStr: number = this._toHashCode(this._toKeyStr(key))
    if (!this._items[keyStr]) return undefined

    let index = keyStr
    let g = this._items[index]
    while (g) {
      if (kVEqualFn(g, new KeyValue(key, null))) return g.value

      index += 1
      g = this._items[index]
    }

    return undefined
  }

  /**
   * Removes the key from the hash map using linear probing.
   *
   * 使用线性探查在哈希表中删除该键。
   *
   * Time complexity: O(1) average, O(n) worst case
   *
   * Space complexity: O(1)
   *
   * @param key - The key object.
   *
   * @returns Whether the removal is successful.
   */
  public remove(key: K): boolean {
    const keyStr: number = this._toHashCode(this._toKeyStr(key))
    if (!this._items[keyStr]) return false

    let index = keyStr
    let g = this._items[index]
    while (g) {
      if (kVEqualFn(g, new KeyValue(key, null))) {
        this._items[index] = EMPTY_KEY_VALUE as KeyValue<K, V>
        this._size -= 1
        return true
      }

      index += 1
      g = this._items[index]
    }

    return false
  }
}
