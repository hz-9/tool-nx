/**
 * @public
 *
 * Callback parameter type for the .find traversal function.
 *
 * .find 遍历函数 回调参数类型
 */
export type FindCallback<T> = (value: T) => boolean

/**
 * @public
 *
 * Callback function for inorder traversal, preorder traversal, and postorder traversal.
 *
 * 中序遍历、先序遍历、后序遍历 回调函数
 */
export type OrderTraverseCallback<T> = (value: T) => void

/**
 * @public
 *
 * Callback function for breadth-first search and depth-first search.
 *
 * 广度优先搜索、深度优先搜索 回调函数。
 */
export type SearchCallback<T, E> = (value: T, edge: E) => void
