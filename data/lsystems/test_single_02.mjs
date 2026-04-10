// L-System parameters
export let ls =
{
    axiom: "X",
    rules: {
        F: "-F+F",
        X: "FFF[+X]F[-X]+X"
    },
    alpha: 90 * Math.PI / 180,
    theta: 20 * Math.PI / 180,
    iterations: 9,
    step: 1
};

// SVG parameters
export let svg =
{
    width: 860,
    height: 835,
    padding: 10,
    pathAttributes: {
        // fill: "skyblue",
        stroke: "#69983a",
    },
};
