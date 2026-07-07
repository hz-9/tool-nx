import {
  EMPTY_KEY_VALUE,
  Hashmap,
  IKeyValueObj,
  KeyValue,
  ToHashCode,
  ToKeyStr,
  kVToObj,
  toKeyStrDefault,
} from './_base.hashmap'
import { loseloseHashCode } from './hash-code'

/**
 * @public
 *
 * A simple hashmap.
 * It is prone to key collision issues, where conflicting keys cannot be added to the hashmap.
 *
 * 一个简单的哈希表。
 * 它容易遇到键冲突问题，冲突的键无法添加到哈希表中。
 */
export class SimpleHashmap<K, V> implements Hashmap<K, V> {
  protected _items: Record<number, KeyValue<K, V>>

  protected _size: number

  protected _toKeyStr: ToKeyStr<K>

  protected _toHashCode: ToHashCode

  /**
   * Constructs a new simple hash map.
   *
   * 构造一个新的简单哈希表。
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
   * Time complexity: O(1)
   *
   * Space complexity: O(1)
   *
   * @param key - The key object.
   * @param value - The value information.
   *
   * @returns Whether the addition is successful. Returns false if the key already exists.
   */
  public set(key: K, value: V): boolean {
    const keyStr: number = this._toHashCode(this._toKeyStr(key))

    const isUpdate = !!this._items[keyStr]

    this._items[keyStr] = new KeyValue<K, V>(key, value)
    if (!isUpdate) this._size += 1
    return true
  }

  /**
   * Retrieves the value from the hash map based on the key.
   *
   * 根据键从哈希表中获取值。
   *
   * Time complexity: O(1)
   *
   * Space complexity: O(1)
   *
   * @param key - The key object.
   *
   * @returns The value object. Returns undefined if the key does not exist.
   */
  public get(key: K): V | undefined {
    const keyStr: number = this._toHashCode(this._toKeyStr(key))
    return this._items[keyStr]?.value
  }

  /**
   * Checks if the hash map contains a value for the key.
   *
   * 判断在哈希表中是否有该键的值。
   *
   * Time complexity: O(1)
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
   * Time complexity: O(1)
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

    delete this._items[keyStr]
    this._size -= 1
    return true
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
      const kv = this._items[+key]

      if (kv.key !== EMPTY_KEY_VALUE.key) {
        const s = `${this._toKeyStr(kv.key)}: ${kv.toString()}`
        str += str === '' ? s : `\n${s}`
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

    Object.values(this._items).forEach((kv) => {
      if (kv.key !== EMPTY_KEY_VALUE.key) {
        array.push(kVToObj(kv))
      }
    })

    return array
  }
}
