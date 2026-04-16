// L-System parameters
export let ls = {
  lid: "plant 3",
  axiom: "X",
  rules: {
    F: "FX",
    X: "F[+X][-X]-F+X",
  },
  alpha: 70 * Math.PI / 180,
  theta: 25.71 * Math.PI / 180,
  iterations: 7,
  step: 2.5
};

// SVG parameters
export let svg =
{
  // width: "500px",
  pathAttributes: {
    stroke: ["forestgreen", "forestgreen", "forestgreen", "yellow"],
    "stroke-width": ["1.4", "1"]
  }
};
