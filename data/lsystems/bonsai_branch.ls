// L-System parameters
export let ls =
{
  lid: "bonsai branch",
  axiom: "A",
  rules: {
    F: "F",
    A: "F-FFA+[FAFA+FFF]F",
  },
  alpha: 90 * Math.PI / 180,
  theta: 30 * Math.PI / 180,
  iterations: 5,
  step: 9
}

// SVG parameters
export let svg =
{
  // width: "500px",
  "pathAttributes": {
    stroke: ["olive", "darkolivegreen", "forestgreen"],
    "stroke-width": ["5", "3", "2", "1"],
    "stroke-linecap": "round"
  }
}