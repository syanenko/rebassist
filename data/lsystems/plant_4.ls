// L-System parameters
export let ls =
{
  lid: "plant 4",
  axiom: "--------C",
  rules: {
    F: "F",
    C: "NF[--P]F+C",
    N: "NFF",
    P: "Q",
    Q: "C",
  },
  alpha: 0 * Math.PI / 180,
  theta: 11.25 * Math.PI / 180,
  iterations: 20,
  step: 1.2,
}

// SVG parameters
export let svg =
{
  // width: "500px",
  "pathAttributes": {
    stroke: ["#260", "#160", "#080", "#080", "#6a0"],
    "stroke-width": ["3", "2", "2", "1"]
  }
}
