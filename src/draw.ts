import { Regl } from 'regl'
import { NodeAttrs } from './types'

const createLine = (regl: Regl) =>
  regl({
    frag: `
    #extension GL_OES_standard_derivatives : enable
    precision mediump float;
    uniform vec4 color;
    void main() {
      gl_FragColor = color;
    }`,

    vert: `
    precision mediump float;
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0, 1);
    }`,

    attributes: {
      position: regl.prop<NodeAttrs, keyof NodeAttrs>('position'),
    },

    elements: regl.prop<NodeAttrs, keyof NodeAttrs>('elements'),

    uniforms: {
      color: [0, 0, 0, 1],
    },

    primitive: regl.prop<NodeAttrs, keyof NodeAttrs>('primitive'),
    count: (_, attrs: NodeAttrs) => {
      return attrs.elements ? attrs.elements.length * 3 : attrs.position.length
    },
  })

const createPoints = (regl: Regl) =>
  regl({
    frag: `
    // https://github.com/processing/p5.js/blob/master/src/webgl/shaders/point.frag
    precision mediump float;
    uniform vec4 color;
    void main() {
      if (length(gl_PointCoord.xy - 0.5) > 0.5) {
        discard;
      }
      gl_FragColor = color;
    }`,

    vert: `
    precision mediump float;
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0, 1);
      gl_PointSize = 10.0;
    }`,

    attributes: {
      position: regl.prop<NodeAttrs, keyof NodeAttrs>('position'),
    },

    uniforms: {
      color: [1, 0, 0, 1],
    },

    primitive: 'points',
    count: (_, attrs: NodeAttrs) => {
      return attrs.position.length
    },
  })

export interface Draw {
  line(attrs: NodeAttrs): void
  points(attrs: NodeAttrs): void
}

export const createDraw = (regl: Regl): Draw => ({
  line: createLine(regl),
  points: createPoints(regl),
})
