// L-System parameters
export let ls = {
    axiom: "X",
    rules: {
        F: "FF",
        X: "F[+X]F[-X]++X"
    },
    alpha: 90 * Math.PI / 180,
    theta: 20 * Math.PI / 180,
    iterations: 9,
    step: 2,
};

// SVG parameters
export let svg =
{
    width: 360,
    height: 535,
    padding: 10,
    pathAttributes: {
        stroke: ["#aabc00", "#abac00", "#bba300", "rgba(250, 50, 0, 1)", "rgba(250, 200, 0, 1)", "rgba(250, 100, 0, 1)", "rgba(250, 70, 0, 1)"],
        "stroke-width": ["6", "4", "3", "2"],
        // fill: "skyblue",
        // "stroke-linecap": ["square", "square", "round"],
        //transform: ["skewY(-35)", "n/a"]
    }
};
