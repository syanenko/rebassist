// L-System parameters
export let ls =
{
  lid: "weed",
  axiom: "F",
  rules: {
    F: "F[+F]F[-F]F",
  },
  alpha: 90 * Math.PI / 180,
  theta: 25.714 * Math.PI / 180,
  iterations: 5,
  step: 3
}

// SVG parameters
export let svg =
{
  // width: "500px",
  "pathAttributes": {
    stroke: ["#080", "#080", "#080", "#9a0"],
    "stroke-width": ["1.5", "1"]
  }
}
