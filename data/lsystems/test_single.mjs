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
    iterations: 6,
    step: 4
};

// SVG parameters
export let svg =
{
//  width: 560,
//  height: 535,
    padding: 10,
    pathAttributes: {
        // fill: "skyblue",
        stroke: ["#005f00", "#00ac00", "#bba300", "rgba(250, 50, 0, 1)", "rgba(250, 100, 0, 1)", "rgba(250, 0, 0, 1)"],
        "stroke-width": ["4", "2", "2", "1"],
        "stroke-linecap": ["square", "square", "round"],
         //transform: ["skewY(-35)", "n/a"]
    }
};
