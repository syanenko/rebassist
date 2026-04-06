// L-System parameters
export let ls =
{
    axiom: "X",
    rules: {
        F: "FF",
        X: "F[+X]F[-X]+X"
    },
    alpha: 90 * Math.PI / 180,
    theta: 20 * Math.PI / 180,
    iterations: 7,
    step: 2,
};

// SVG parameters
export let svg =
{
    width: 360,
    height: 535,
    padding: 10,
    pathAttributes: {
        // fill: "skyblue",
        stroke: "#69983a",
    },
};
