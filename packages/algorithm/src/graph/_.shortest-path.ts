import { Vertice } from './graph'

/**
 * @public
 *
 * Return type for shortest path algorithms.
 *
 * 最短路径算法的返回类型。
 */
export interface IGraphShortestPathReturn<T> {
  /**
   * The shortest distance from the source vertex to each vertex.
   *
   * 从源顶点到每个顶点的最短距离。
   */
  distances: Map<Vertice<T>, number>

  /**
   * The predecessor of each vertex in the shortest path.
   *
   * 最短路径中每个顶点的前驱顶点。
   */
  prodecessors: Map<Vertice<T>, Vertice<T> | undefined>
}
