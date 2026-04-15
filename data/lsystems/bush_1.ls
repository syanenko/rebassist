// L-System parameters
export let ls = {
    lid: "bush 1",
    axiom: "F",
    rules: {
      F: "F[+FF][-FF]F[-F][+F]F",
    },
    alpha: 90 * Math.PI / 180,
    theta: 35 * Math.PI / 180,
    iterations: 4,
    step: 6,
};

// SVG parameters
export let svg =
{
  pathAttributes: {
    stroke: ["#480", "#480", "#9a0", "#9a0", "#ea0"]
  }
};
