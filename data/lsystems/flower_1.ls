// L-System parameters
export let ls = {
  lid: "flower 1",
  axiom: "F[+F+F][-F-F][++F][--F]F",
  rules: {
    F: "FF[++F][+F][F][-F][--F]",
  },
  alpha: 90 * Math.PI / 180,
  theta: 11.25 * Math.PI / 180,
  iterations: 3,
  step: 15
};

// SVG parameters
export let svg =
{
  pathAttributes: {
    stroke: ["#080", "#080", "#080", "#9a0", "#e80"],
    "stroke-width": ["3", "1"]
  }
};
