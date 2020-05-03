import { PrimitiveType } from 'regl'
import { vec2, vec3 } from 'gl-matrix'

export interface NodeAttrs {
  primitive: PrimitiveType
  position: vec2[]
  normal: vec2[]
  edge: vec2[]
  edgeNormal: vec2[]
  elements?: vec3[]
}

export interface NodeStore<T> {
  props: T
  attrs: NodeAttrs
}

export interface Node<T extends {}> {
  attrs: NodeAttrs
  props: T
  update(nextProps: T, nextAttrs?: NodeAttrs): void
  render(): void
}
