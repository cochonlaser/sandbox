import { vec2 } from 'gl-matrix'
import { Node, NodeAttrs, NodeStore } from './types'
import { Draw } from './draw'

type PolylineProps = {
  points: vec2[]
}

function createEdges(position: vec2[]): vec2[] {
  return position.map((_, i) => [i, (i + 1) % position.length])
}

function createEdgeNormals(position: vec2[]): vec2[] {
  return position.map((p, i, px) => {
    const n = vec2.create()
    vec2.sub(n, px[(i + 1) % px.length], p)
    vec2.set(n, -n[1], n[0])
    vec2.normalize(n, n)
    return n
  })
}

function createNormals(edgeNormals: vec2[]): vec2[] {
  return edgeNormals.map((n, i, nx) => {
    const vn = vec2.create()
    vec2.add(vn, n, nx[(i === 0 ? nx.length : i) - 1])
    vec2.normalize(vn, vn)
    return vn
  })
}

export class PolylineNode implements Node<PolylineProps> {
  private draw: Draw
  private store: NodeStore<PolylineProps> = {
    props: PolylineNode.defaultProps,
    attrs: PolylineNode.defaultAttrs,
  }

  static readonly defaultProps: PolylineProps = {
    points: [],
  }

  static readonly defaultAttrs: NodeAttrs = {
    primitive: 'line loop',
    position: [],
    normal: [],
    edge: [],
    edgeNormal: [],
  }

  constructor(draw: Draw) {
    this.draw = draw
  }

  get attrs() {
    return this.store.attrs
  }

  get props() {
    return this.store.props
  }

  update(props: PolylineProps) {
    const position = props.points.map((p) => vec2.clone(p))
    const edge = createEdges(position)
    const edgeNormal = createEdgeNormals(position)
    const normal = createNormals(edgeNormal)

    this.store = {
      props,
      attrs: {
        ...PolylineNode.defaultAttrs,
        position,
        normal,
        edge,
        edgeNormal,
      },
    }
  }

  render() {
    this.draw.line(this.attrs)
  }
}
