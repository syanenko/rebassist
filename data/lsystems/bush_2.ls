// L-System parameters
export let ls = {
  lid: "bush 2",
  axiom: "F",
  rules: {
    F: "FF+[+F-F-F]-[-F+F+F]",
  },
  alpha: 90 * Math.PI / 180,
  theta: 22.5 * Math.PI / 180,
  iterations: 4,
  step: 9
};

// SVG parameters
export let svg =
{
  pathAttributes: {
    stroke: ["#380", "#480", "#690", "#690", "#cb0"],
    "stroke-width": ["4", "3", "2", "1"]
  }
};
