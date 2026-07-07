import { Compare } from '../_base'
import { TreeNode } from './_base.tree'
import { BinarySearchTree } from './binary-search.tree'

enum Color {
  RED = 'red',
  BLACK = 'black',
}

/* eslint-disable no-param-reassign */

/**
 * @public
 *
 *  Red-Black Tree Node
 *
 *  红黑树节点
 */
export class RedBlackTreeNode<T> extends TreeNode<T> {
  /**
   * Parent node reference.
   *
   * 父节点引用。
   */
  public parent: RedBlackTreeNode<T> | undefined

  /**
   * Node color (red or black).
   *
   * 节点颜色（红或黑）。
   */
  public color: Color | undefined

  /**
   * Left child node.
   *
   * 左子节点。
   */
  public left: RedBlackTreeNode<T> | undefined

  /**
   * Right child node.
   *
   * 右子节点。
   */
  public right: RedBlackTreeNode<T> | undefined

  /**
   * Constructs a new red-black tree node.
   *
   * 构造一个新的红黑树节点。
   *
   * @param val - The node value.
   * @param left - The left child node.
   * @param right - The right child node.
   */
  public constructor(val: T, left?: RedBlackTreeNode<T>, right?: RedBlackTreeNode<T>) {
    super(val, left, right)

    this.parent = undefined

    this.color = undefined
  }
}

/**
 * @public
 *
 *  Red-Black Tree
 *
 *  红黑树
 */
export class RedBlackTree<T> extends BinarySearchTree<T> {
  protected _root?: RedBlackTreeNode<T>

  /**
   * Add a value to a node and return the new or updated node.
   *
   * 将一个值添加到节点中，并返回新节点或更新后的节点。
   *
   * @param node - The base node.
   * @param value - The value to be added.
   */
  protected _addNode(node: RedBlackTreeNode<T> | undefined, value: T): RedBlackTreeNode<T> | undefined {
    if (!node) {
      this._size += 1
      const newNode = new RedBlackTreeNode(value)
      newNode.color = Color.RED
      return newNode
    }

    if (this._compareFn(value, node.val) === Compare.LESS_THAN) {
      if (!node.left) {
        node.left = this._addNode(node.left, value) as RedBlackTreeNode<T>
        node.left.parent = node
        return node.left
      }
      return this._addNode(node.left, value)
    }

    if (this._compareFn(value, node.val) === Compare.BIGGER_THAN) {
      if (!node.right) {
        node.right = this._addNode(node.right, value) as RedBlackTreeNode<T>
        node.right.parent = node
        return node.right
      }
      return this._addNode(node.right, value)
    }

    return node
  }

  /**
   * Fix the red-black tree properties after insertion.
   *
   * 插入后修复红黑树属性。
   *
   * @param node - The node to start fixing from.
   */
  protected _fixTreeNode(node: RedBlackTreeNode<T>): void {
    while (node.parent && node.parent.color === Color.RED && node.color !== Color.BLACK) {
      let parent = node.parent as RedBlackTreeNode<T>
      const grandParent = parent?.parent

      if (grandParent && parent) {
        // Case A: Parent is the left child of the grandparent
        if (grandParent && grandParent.left === parent) {
          const uncle = grandParent.right
          if (uncle && uncle.color === Color.RED) {
            grandParent.color = Color.RED
            parent.color = Color.BLACK
            uncle.color = Color.BLACK
            node = grandParent
          } else {
            // Case 2A: Uncle is black and the current node is the right child
            if (node === parent.right) {
              this.rotationRR(parent)
              node = parent
              parent = node.parent!
            }
            // Case 3A: Uncle is black and the current node is the left child
            this.rotationLL(grandParent)
            parent.color = Color.BLACK
            grandParent.color = Color.RED
            node = parent
          }
        } else {
          // Case B: Parent is the right child of the grandparent
          const uncle = grandParent?.left
          if (uncle && uncle?.color === Color.RED) {
            grandParent.color = Color.RED
            parent.color = Color.BLACK
            uncle.color = Color.BLACK
            node = grandParent
          } else {
            // Case 2B: Uncle is black and the current node is the left child
            if (node === parent.left) {
              this.rotationLL(parent)
              node = parent
              parent = node.parent!
            }
            // Case 3B: Uncle is black and the current node is the right child
            this.rotationRR(grandParent)
            parent.color = Color.BLACK
            grandParent.color = Color.RED
            node = parent
          }
        }
        if (this._root) this._root.color = Color.BLACK
      }
    }
  }

  /**
   * Left rotation (Left-Left case).
   *
   * 左旋转（左-左情况）。
   *
   * @param node - The node to rotate.
   */
  protected rotationLL(node: RedBlackTreeNode<T>): void {
    const tmp = node.left
    if (tmp) {
      node.left = tmp.right
      if (tmp.right) {
        tmp.right.parent = node
      }
      tmp.parent = node.parent
    }
    if (!node.parent) {
      this._root = tmp
    } else if (node === node.parent.left) {
      node.parent.left = tmp
    } else {
      node.parent.right = tmp
    }
    if (tmp) {
      tmp.right = node
    }
    node.parent = tmp
  }

  /**
   * Right rotation (Right-Right case).
   *
   * 右旋转（右-右情况）。
   *
   * @param node - The node to rotate.
   */
  protected rotationRR(node: RedBlackTreeNode<T>): void {
    const tmp = node.right
    if (tmp) {
      node.right = tmp.left
      if (tmp.left) {
        tmp.left.parent = node
      }
      tmp.parent = node.parent
    }
    if (!node.parent) {
      this._root = tmp
    } else if (node === node.parent.left) {
      node.parent.left = tmp
    } else {
      node.parent.right = tmp
    }
    if (tmp) {
      tmp.left = node
    }
    node.parent = tmp
  }

  /**
   * Add an element to the red-black tree.
   *
   * 添加一个元素到红黑树中。
   *
   * Time complexity: O(log n)
   *
   * Space complexity: O(1)
   *
   * @param value - The value to be added.
   */
  public add(value: T): void {
    if (!this._root) {
      this._root = new RedBlackTreeNode(value)
      this._root.color = Color.BLACK
      this._size = 1
    } else {
      const node = this._addNode(this._root, value) as RedBlackTreeNode<T>
      this._fixTreeNode(node)
    }
  }
}
