// L-System parameters
export let ls =
{
  "_version": "2.8.2",
  "axiom": "AF",
  "alpha": 90 * Math.PI / 180,
  "theta": 12 * Math.PI / 180,
  "step": 2,
  "iterations": 17,
  "rules": {
    "A": "FFFFFV[+++H][---Q]BW",
    "B": "B",
    "C": "FFFFFV[+++BA]BD",
    "D": "FFFFFV[+++H][---Q]BE",
    "E": "FFFFFV[+++H][---Q]BG",
    "F": "F",
    "G": "FFFFFV[---BA]BA",
    "H": "IBFF",
    "I": "BFFF[--M]J",
    "J": "BFFF[--N]K",
    "K": "BFFF[--O]L",
    "L": "BFFF[--P]",
    "M": "BFN",
    "N": "BFO",
    "O": "BFP",
    "P": "BF",
    "Q": "RBF",
    "R": "BFFF[++M]S",
    "S": "BFFF[++N]T",
    "T": "BFFF[++O]U",
    "U": "BFFF[++P]",
    "V": "FV",
    "W": "FFFFFV[+++H][---Q]BC"
  }
}

// SVG parameters
export let svg =
{
  "pathAttributes": {
    "stroke": "seagreen"
  }
}