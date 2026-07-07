import { SinglyLinkedList } from '../linked-list/singly.linked-list'
import {
  Hashmap,
  IKeyValueObj,
  KeyValue,
  ToHashCode,
  ToKeyStr,
  kVEqualFn,
  kVToObj,
  toKeyStrDefault,
} from './_base.hashmap'
import { loseloseHashCode } from './hash-code'

/**
 * @public
 *
 * A hash map with linked list chaining.
 * When encountering hash collisions, it continues to search in the linked list.
 *
 * 一个链式寻址的哈希表。
 * 若遇到哈希值冲突时，将会根据在链表中继续寻找。
 *
 */
export class LinkedListHashmap<K, V> implements Hashmap<K, V> {
  protected _items: Record<number, SinglyLinkedList<KeyValue<K, V>>>

  protected _size: number

  protected _toKeyStr: ToKeyStr<K>

  protected _toHashCode: ToHashCode

  /**
   * Constructs a new linked-list chaining hash map.
   *
   * 构造一个新的链式寻址哈希表。
   *
   * @param toKeyStr - Function to convert a key to a string.
   * @param toHashCode - Function to convert a string key to a hash code.
   */
  public constructor(toKeyStr: ToKeyStr<K> = toKeyStrDefault, toHashCode: ToHashCode = loseloseHashCode) {
    this._items = {}

    this._size = 0

    this._toKeyStr = toKeyStr

    this._toHashCode = toHashCode
  }

  /**
   * The number of key-value pairs in the hash map.
   *
   * 哈希表中键值对的数量。
   */
  public get size(): number {
    return this._size
  }

  /**
   * Whether the hash map is empty.
   *
   * 哈希表是否为空。
   */
  public get isEmpty(): boolean {
    return this.size === 0
  }

  /**
   * Adds a key-value pair to the hash map.
   *
   * 将键值对添加到哈希表中。
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

    if (!this._items[keyStr]) {
      this._items[keyStr] = new SinglyLinkedList<KeyValue<K, V>>(kVEqualFn)
    }

    let hasUpdate = false
    const kv = new KeyValue<K, V>(key, value)
    let { headNode } = this._items[keyStr]
    while (headNode) {
      if (kVEqualFn(headNode.val, kv)) {
        headNode.val = kv
        hasUpdate = true
        break
      }

      headNode = headNode.next
    }

    if (!hasUpdate) {
      this._items[keyStr].push(kv)
      this._size += 1
    }

    return true
  }

  /**
   * Retrieves the value from the hash map based on the key.
   *
   * 根据键从哈希表中获取值。
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

    let { headNode } = this._items[keyStr]
    while (headNode) {
      if (headNode.val.key === key) return headNode.val.value
      headNode = headNode.next
    }

    return undefined
  }

  /**
   * Checks if the hash map contains a value for the key.
   *
   * 判断在哈希表中是否有该键的值。
   *
   * Time complexity: O(1) average, O(n) worst case
   *
   * Space complexity: O(1)
   *
   * @param key - The key object.
   *
   * @returns Whether the key has a value in the hash map.
   */
  public has(key: K): boolean {
    return !!this.get(key)
  }

  /**
   * Removes the key from the hash map.
   *
   * 在哈希表中删除该键。
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

    const removeResult = this._items[keyStr].remove(new KeyValue<K, V>(key, null as V))
    if (removeResult) this._size -= 1
    if (this._items[keyStr].isEmpty) delete this._items[keyStr]
    return removeResult
  }

  /**
   * Clear the hash map.
   *
   * 清空哈希表。
   *
   * Time complexity: O(1)
   *
   * Space complexity: O(1)
   */
  public clear(): void {
    this._size = 0
    this._items = {}
  }

  /**
   * Returns a string representation of the hash map.
   *
   * 返回哈希表的字符串表示。
   *
   * @returns The string representation.
   */
  public toString(): string {
    let str = ''

    Object.keys(this._items).forEach((key) => {
      let { headNode } = this._items[+key]
      while (headNode) {
        const headStr = this._toKeyStr(headNode.val.key)
        const s = `${headStr}: ${headNode.val.toString()}`

        str += str === '' ? s : `\n${s}`

        headNode = headNode.next
      }
    })

    return str
  }

  /**
   * Returns an array representation of the hash map.
   *
   * 返回哈希表的数组表示。
   *
   * @returns The array representation.
   */
  public toArray(): IKeyValueObj<K, V>[] {
    const array: IKeyValueObj<K, V>[] = []

    Object.keys(this._items).forEach((key) => {
      let { headNode } = this._items[+key]
      while (headNode) {
        array.push(kVToObj(headNode.val))
        headNode = headNode.next
      }
    })

    return array
  }
}
