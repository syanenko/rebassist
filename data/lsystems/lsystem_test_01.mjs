// L-System parameters
export let ls =
{
    axiom: "FFF+FFFF-FF+FF-[-Y][+Y][!Z!][+Z]",
    rules: {
        F: "F",
        Y: "FF+F-F-F[FFFZ][+Z]-F-FZ",
        Z: "FF-F+F+F[FY][-Y]+F+F++Y"
    },
    alpha: 90 * Math.PI / 180,
    theta: 10 * Math.PI / 180,
    iterations: 7,
    step: 5
};

// SVG parameters
export let svg =
{
    width: 820,
    height: 625,
    padding: 10,
    pathAttributes: {
        stroke: ["#514d3a", "#514d3a", "#514d2a", "#55771c", "#55771c", "#44621c",
            "rgba(131, 163, 90, 0.5)", "rgba(164, 184, 102, 0.5)", "rgba(192, 200, 97, 0.5)"],
        "stroke-width": ["10", "5", "3", "1"],
        "stroke-linecap": ["square", "square", "round"],
        transform: ["skewY(-35)", "n/a"],
    }
}
