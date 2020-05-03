import cdt2d from 'cdt2d'
import { vec2 } from 'gl-matrix'
import { Node, NodeAttrs, NodeStore } from './types'
import { Draw } from './draw'

type ExpandProps = {
  distance: number
}

// function flatten(data: vec2[]) {
//   const dim = data[0].length
//   const out = new Float32Array(data.length * dim)
//   for (let i = 0; i < data.length; i++) {
//     out.set(data[i], i * dim)
//   }
//   return out
// }

export class ExpandNode implements Node<ExpandProps> {
  private draw: Draw
  private store: NodeStore<ExpandProps> = {
    props: ExpandNode.defaultProps,
    attrs: ExpandNode.defaultAttrs,
  }

  static readonly defaultProps: ExpandProps = {
    distance: 1,
  }

  static readonly defaultAttrs: NodeAttrs = {
    primitive: 'triangle strip',
    position: [],
    normal: [],
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

  update(nextProps: ExpandProps, nextAttrs: NodeAttrs) {
    const props = { ...ExpandNode.defaultProps, ...nextProps }
    const plen = nextAttrs.position.length
    const dist = props.distance

    let position = []
    let edge = []
    let edgeNormal = []
    let normal = []

    // TODO: split in 2 passes and reuse functions from polyline
    for (let i = 0; i < plen; i++) {
      const p = nextAttrs.position[i]
      const n = nextAttrs.normal[i]
      const e = nextAttrs.edge[i]
      const en = nextAttrs.edgeNormal[i]

      position[i] = vec2.fromValues(p[0] + n[0] * dist, p[1] + n[1] * dist)
      position[i + plen] = vec2.fromValues(
        p[0] - n[0] * dist,
        p[1] - n[1] * dist
      )

      edge[i] = vec2.clone(e)
      edge[i + plen] = [e[0] + plen, e[1] + plen]
    }

    // const position = nextAttrs.position.flatMap(([x, y], i) => {
    //   const n = nextAttrs.normal[i]
    //   return [
    //     vec2.fromValues(x + Math.cos(n[0]) * 0.1, y + Math.sin(n[1]) * 0.1),
    //     vec2.fromValues(x - Math.cos(n[0]) * 0.1, y - Math.sin(n[1]) * 0.1),
    //   ]
    // })

    // const edges = [
    //   ...nextAttrs.position.map((_, i, px) => [i, (i + 2) % px.length]),
    //   // ...nextAttrs.position.map((_, i, px) => [
    //   //   i + px.length,
    //   //   (i + 2 + px.length) % (2 * px.length),
    //   // ]),
    // ]

    // console.log(position)
    // console.log(edges)
    // console.log(cdt2d(position, edges))

    const attrs = {
      ...ExpandNode.defaultAttrs,
      primitive: 'triangles',
      position,
      elements: cdt2d(position, edge, { exterior: false }),
      normal: nextAttrs.normal.flatMap((n) => [n, n]),
    }

    this.store = {
      props,
      attrs,
    }
  }

  render() {
    this.draw.points(this.attrs)
    this.draw.line(this.attrs)
  }
}
