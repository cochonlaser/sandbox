import createRegl from 'regl'

import { createDraw } from './draw'

import { ExpandNode } from './expand'
import { JitterNode } from './jitter'
import { PolylineNode } from './polyline'

const regl = createRegl({ extensions: ['oes_standard_derivatives'] })

regl.clear({
  color: [0, 0, 0, 0],
  depth: 1,
})

const draw = createDraw(regl)

const linePoints = []
for (let i = 0; i < 2 * Math.PI; i++) {
  linePoints.push([Math.cos(i) * 0.6, Math.sin(i) * 0.6])
}

const line = new PolylineNode(draw)
line.update({
  points: linePoints,
  // points: [
  //   [-0.5, -0.5],
  //   [-0.5, +0.5],
  //   [+0.5, +0.5],
  //   [+0.5, -0.5],
  // ],
})

const jitter = new JitterNode(draw)
jitter.update({ scale: 0.4 }, line.attrs)

const extrude = new ExpandNode(draw)
extrude.update({ distance: 0.2 }, jitter.attrs)
extrude.render()
