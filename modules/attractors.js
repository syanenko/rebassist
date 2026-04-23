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

  x0: 0.1,
  y0: 0,
  z0: 0,

  N: 20000,

  x: (x, y, z, a, b, c, h) => { return x + h * a * (y - x);       },
  y: (x, y, z, a, b, c, h) => { return y + h * (x * (b - z) - y); },
  z: (x, y, z, a, b, c, h) => { return z + h * (x * y - c * z);   },

  scale: 0.07,

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

  x0: 0.1,
  y0: 0,
  z0: 0,

  N: 20000,

  x: (x, y, z, a, b, c, h) => { return x + h * a * (y - x);       },
  y: (x, y, z, a, b, c, h) => { return y + h * (x * (b - z) - y); },
  z: (x, y, z, a, b, c, h) => { return z + h * (x * y - c * z);   },

  scale: 0.06,

  correctMips: true,
  fastChroma: false,
  antialias: true,
  gamma: false,
  anx: false,
  any: false,
  anz: false,
  speed: 0
},
// 2. Thomas
{ name: "Thomas",
  r: 0.0,
  g: 0.0,
  b: 0.0,

  A: 2.64,
  B: 0.001,
  C: 8.0 / 3.0,
  H: 0.002,

  x0: 0.1,
  y0: 0,
  z0: 0,

  N: 2300,

  x: (x, y, z, a, b, c, h) => { return Math.sin(y) - b * x; },
  y: (x, y, z, a, b, c, h) => { return Math.sin(z) - b * y; },
  z: (x, y, z, a, b, c, h) => { return Math.sin(x) - b * z; },

  scale: 15,

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
{ name: "Sprott",
  r: 0.0,
  g: 0.0,
  b: 0.0,

  A: 2.07,
  B: 1.79,
  C: 8.0 / 3.0,
  H: 0.002,

  x0: 0.1,
  y0: 0,
  z0: 0,

  N: 20000,

  x: (x, y, z, a, b, c, h) => { return y + a*x*y + x*z; },
  y: (x, y, z, a, b, c, h) => { return 1 - b*x*x + y*z; },
  z: (x, y, z, a, b, c, h) => { return x - x*x - y*y;   },

  scale: 0.04,

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
{ name: "Lorenz 3",
  r: 0.0,
  g: 0.0,
  b: 0.0,

  A: 10.0,
  B: 22.7,
  C: 8.0 / 3.0,
  H: 0.002,

  x0: 0.1,
  y0: 0,
  z0: 0,

  N: 20000,

  x: (x, y, z, a, b, c, h) => { return x + h * a * (y - y / x)   },
  y: (x, y, z, a, b, c, h) => { return y + h * (x * (b - z) - y) },
  z: (x, y, z, a, b, c, h) => { return z + h * (x * y - c * z)   },

  scale: 0.008,

  correctMips: true,
  fastChroma: false,
  antialias: true,
  gamma: false,
  anx: false,
  any: false,
  anz: false,
  speed: 0
},
// 5
{ name: "Lorenz 4",
  r: 0.0,
  g: 0.0,
  b: 0.0,

  A: 10.0,
  B: 21.7,
  C: 8.0 / 3.0,
  H: 0.001,

  N: 20000,

  x0: 0.1,
  y0: 0,
  z0: 0,

  x: (x, y, z, a, b, c, h) => { return x + h * a * (y - y / x)   },
  y: (x, y, z, a, b, c, h) => { return y + h * (x * (b - z) - y) },
  z: (x, y, z, a, b, c, h) => { return z + h * (x * y - c * z)   },

  scale: 0.005,

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
