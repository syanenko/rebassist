// L-System parameters
export let ls =
{
  lid: "algae",
  axiom: "AF",
  rules: {
    A: "FFFFFV[+++H][---Q]BW",
    B: "B",
    C: "FFFFFV[+++BA]BD",
    D: "FFFFFV[+++H][---Q]BE",
    E: "FFFFFV[+++H][---Q]BG",
    F: "F",
    G: "FFFFFV[---BA]BA",
    H: "IBFF",
    I: "BFFF[--M]J",
    J: "BFFF[--N]K",
    K: "BFFF[--O]L",
    L: "BFFF[--P]",
    M: "BFN",
    N: "BFO",
    O: "BFP",
    P: "BF",
    Q: "RBF",
    R: "BFFF[++M]S",
    S: "BFFF[++N]T",
    T: "BFFF[++O]U",
    U: "BFFF[++P]",
    V: "FV",
    W: "FFFFFV[+++H][---Q]BC",
  },
  alpha: 90 * Math.PI / 180,
  theta: 12 * Math.PI / 180,
  iterations: 17,
  step: 2.5
}

// SVG parameters
export let svg =
{
  // width: "500px",
  "pathAttributes": {
    "stroke": "seagreen"
  }
}