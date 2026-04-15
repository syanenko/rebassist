// L-System parameters
export let ls = {
  lid: "dandelion",
  axiom: "FFFFFF[-Y][Z][+Z]",
  rules: {
    F: "F",
    Y: "FF+F-F-F[FFFZ][+Z]-F-FZ",
    Z: "FF-F+F+F[Y][-Y]+F+FY",
  },
  alpha: 90 * Math.PI / 180,
  theta: 15 * Math.PI / 180,
  iterations: 7,
  step: 8
};

// SVG parameters
export let svg =
{
  // width: "500px",
  pathAttributes: {
    stroke: ["#690", "#7a0", "#9a0", "#aa0", "#aa0", "#cb0", "#dd0", "#ed0"],
    "stroke-width": ["5", "2", "2", "1"],
    "stroke-linecap": "square"
  }
};
