// L-System parameters
export let ls =
{
  lid: "plant 1",
  axiom: "X",
  rules: {
    F: "FF",
    X: "F-[[X]+X]+F[+FX]-X",
  },
  alpha: 90 * Math.PI / 180,
  theta: 25 * Math.PI / 180,
  iterations: 6,
  step: 4
}

// SVG parameters
export let svg =
{
  "pathAttributes": {
    stroke: ["#080", "#080", "#080", "#080", "#080", "#080", "#8a0"],
  }
}
