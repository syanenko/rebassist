export let presets = [
// 0. Current
{ name: "None",
  r: 0.0,
  g: 0.0,
  b: 0.0,

  A: 10.0,
  B: 21.7,
  C: 8.0 / 3.0,
  H: 0.002,

  x: (x0, H, a, y0) => { return x0 + H * a * (y0 - x0) },
  y: (y0, H, x0, b, z0) => { return y0 + H * (x0 * (b - z0) - y0) },
  z: (z0, H, x0, y0, c) => { return z0 + H * (x0 * y0 - c * z0) },

  correctMips: true,
  fastChroma: false,
  antialias: true,
  gamma: false,
  anx: false,
  any: false,
  anz: false,
  speed: 0
},
// 1. Lorenz: https://paulbourke.net/fractals/lorenz/
{ name: "Lorenz 1",
  r: 0.0,
  g: 0.0,
  b: 0.0,

  A: 10.0,
  B: 21.7,
  C: 8.0 / 3.0,
  H: 0.002,

  x: (x0, H, a, y0) => { return x0 + H * a * (y0 - x0) },
  y: (y0, H, x0, b, z0) => { return y0 + H * (x0 * (b - z0) - y0) },
  z: (z0, H, x0, y0, c) => { return z0 + H * (x0 * y0 - c * z0) },

  correctMips: true,
  fastChroma: false,
  antialias: true,
  gamma: false,
  anx: false,
  any: false,
  anz: false,
  speed: 0
},
// 2. Lorenz custom 
{ name: "Lorenz 2",
  r: 0.0,
  g: 0.0,
  b: 0.0,

  A: 2.64,
  B: 21.7,
  C: 8.0 / 3.0,
  H: 0.002,

  x: (x0, H, a, y0) => { return x0 + H * a * (y0 - y0 / x0) },
  y: (y0, H, x0, b, z0) => { return y0 + H * (x0 * (b - z0) - y0) },
  z: (z0, H, x0, y0, c) => { return z0 + H * (x0 * y0 - c * z0) },

  correctMips: true,
  fastChroma: false,
  antialias: true,
  gamma: false,
  anx: false,
  any: false,
  anz: false,
  speed: 0
},
// 3
{ name: "Lorenz 3",
  r: 0.0,
  g: 0.0,
  b: 0.0,

  A: 10.0,
  B: 22.7,
  C: 8.0 / 3.0,
  H: 0.002,

  x: (x0, H, a, y0) => { return x0 + H * a * (y0 - y0 / x0) },
  y: (y0, H, x0, b, z0) => { return y0 + H * (x0 * (b - z0) - y0) },
  z: (z0, H, x0, y0, c) => { return z0 + H * (x0 * y0 - c * z0) },

  correctMips: true,
  fastChroma: false,
  antialias: true,
  gamma: false,
  anx: false,
  any: false,
  anz: false,
  speed: 0
},
// 4
{ name: "Lorenz 4",
  r: 0.0,
  g: 0.0,
  b: 0.0,

  A: 10.0,
  B: 21.7,
  C: 8.0 / 3.0,
  H: 0.001,

  x: (x0, H, a, y0) => { return x0 + H * a * (y0 - y0 / x0) },
  y: (y0, H, x0, b, z0) => { return y0 + H * (x0 * (b - z0) - y0) },
  z: (z0, H, x0, y0, c) => { return z0 + H * (x0 * y0 - c * z0) },

  correctMips: true,
  fastChroma: false,
  antialias: true,
  gamma: false,
  anx: false,
  any: false,
  anz: false,
  speed: 0
}
];
