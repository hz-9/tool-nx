import { Vertice } from './graph'

export interface IGraphShortestPathReturn<T> {
  distances: Map<Vertice<T>, number>

  prodecessors: Map<Vertice<T>, Vertice<T> | undefined>
}
