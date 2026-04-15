// L-System parameters
export let ls = {
  lid: "grass",
  axiom: "[X][Y]++[X][Y]++[X][Y]++[X][Y]++[X][Y]",
  rules: {
    W: "YF++ZF----XF[-YF----WF]++",
    X: "+YF--ZF[---WF--XF]+",
    Y: "-WF++XF[+++YF++ZF]-",
    Z: "--YF++++WF[+ZF++++XF]--XF",
  },
  alpha: 110 * Math.PI / 180,
  theta: 5 * Math.PI / 180,
  step: 10,
  iterations: 4
};

// SVG parameters
export let svg =
{
  pathAttributes: {
    stroke: ["olivedrab", "forestgreen", "seagreen", "#cb0", "#f80"],
    "stroke-width": ["3", "2", "1"]
  }
};
