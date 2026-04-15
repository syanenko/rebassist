// L-System parameters
export let ls = {
  lid: "liana sarment",
  axiom: "FYX",
  rules: {
    F: "FFFXYFXY-[FFFXYFXY]",
    X: "Y[[XY]+X]+F[+FX]+XF",
    Y: "[FFF[[YX]+Y]+F[+FY]+F]",
  },
  alpha: 90 * Math.PI / 180,
  theta: 20 * Math.PI / 180,
  iterations: 4,
  step: 0.8
};

// SVG parameters
export let svg =
{
  // width: "500px",
  pathAttributes: {
    stroke: "forestgreen",
    "stroke-width": ["4", "3", "2", "1"]
  }
};
