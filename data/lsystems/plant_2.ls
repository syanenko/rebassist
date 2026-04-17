// L-System parameters
export let ls =
{
  lid: "plant 2",
  axiom: "F",
  rules: {
    F: "F[+F]F[-F][F]",
  },
  alpha: 90 * Math.PI / 180,
  theta: 20 * Math.PI / 180,
  iterations: 5,
  step: 10
}

// SVG parameters
export let svg =
{
  // width: "500px",
  "pathAttributes": {
    stroke: ["#260", "#160", "#080", "#080", "#8a0", "#850"],
    "stroke-width": ["3", "2", "2", "1"]
  }
}
