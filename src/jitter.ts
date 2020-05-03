import { vec2 } from 'gl-matrix'
import { Node, NodeAttrs, NodeStore } from './types'
import { Draw } from './draw'

type JitterProps = {
  scale: number
}

export class JitterNode implements Node<JitterProps> {
  private draw: Draw
  private store: NodeStore<JitterProps> = {
    props: JitterNode.defaultProps,
    attrs: JitterNode.defaultAttrs,
  }

  static readonly defaultProps: JitterProps = {
    scale: 1,
  }

  static readonly defaultAttrs: NodeAttrs = {
    primitive: 'triangle strip',
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

  update(nextProps: JitterProps, nextAttrs?: NodeAttrs) {
    const props = { ...JitterNode.defaultProps, ...nextProps }

    const attrs = {
      ...JitterNode.defaultAttrs,
      ...nextAttrs,
      position: nextAttrs.position.map((p) =>
        vec2.fromValues(
          p[0] + (Math.random() - 0.5) * nextProps.scale,
          p[1] + (Math.random() - 0.5) * nextProps.scale
        )
      ),
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
