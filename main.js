//
// 1. Yes ?
// 5. Colorize GUI (?)
//
import { GUI } from './node_modules/lil-gui/dist/lil-gui.esm.min.js';
import { parse } from './node_modules/svg-parser/dist/svg-parser.esm.js';
import { parsePath } from './node_modules/path-data-parser/lib/index.js';

let SCALE = 3.779528; // For Inkscape 'px' per user units
let content;

// GUI
const set = {
  // Artwork
  width: 800,
  height: 800,
  units: "px",
  dpi: 200,

  // Paper
  paper_preset: "EX00 White Simple",
  paper_color: { r: 255, g: 255, b: 255},
  paper_deckled_edges: true,
  paper_scale: 100,
  paper_visible: true,

  // Brush
  brush_tool: "WATERCOLOR",
  brush_preset: "Watercolor/Liner",
  brush_size : 4,
  brush_water: 1,
  brush_opacity: 100,
  brush_pressure: 100,
  brush_dirty_brush: false,
  smudge_only_wet: false,
  keep_layer_wet: false,
  keep_water: false,
  only_water: false,

  brush_paint_type: "PAINT",
  brush_glaze_mode: "OPAQUE",
  brush_color: { r: 48, g: 136, b: 199},
  multi_color_brush: true,
  rotate_multi_color_brush: true,
  smudge: true,  
  spacing: 50,
  opacity_multiplier: 2,

  // Download
  download() {download()},
  upload()   {upload()},
};


const gui = new GUI( {width: 300, title:"Control", closeFolders:true} );
// Buttons
gui.add( set, 'upload' ).name( 'Upload' );
gui.add( set, 'download' ).name( 'Download' );
gui.add( gui.reset(), 'reset' ).name( 'Reset' );

// Artwork 
const artwork = gui.addFolder( 'Artwork' );
const guiWidth = artwork.add( set, 'width', 1, 32000, 1 ).name( 'Width' );
const guiHeight = artwork.add( set, 'height', 1, 32000, 1 ).name( 'Heght' );

//  Only 'px' supported, need to check scale in Inkscape 
artwork.add( set, 'units', [ 'px' ] ).name( 'Units' ); // [ 'px', 'cm', 'in' ]
artwork.add( set, 'dpi', [ '72', '96', '100', '150', '200', '250', '300', '400', '600' ] ).name( 'DPI' );

// Paper
const paper = gui.addFolder( 'Paper' );
paper.add( set, 'paper_preset', [ 'EX00 White Simple', 'CA01 Canvas Artist', 'HP01 Hot Pressed', 'RH00 Aquarelle', 'WK01 Washi' ] ).name( 'Preset' );
const pc = paper.addColor( set, 'paper_color', 255 ).name('Color').onChange( setBackgroundColor );
pc.domElement.querySelector('input[type="text"]').style.display = 'none';
paper.add( set, 'paper_deckled_edges', 64, 1024, 1 ).name( 'Deckled edges' );
paper.add( set, 'paper_scale', 10, 400, 10 ).name( 'Scale' );
paper.add( set, 'paper_visible' ).name( 'Visible' );

// Brush
const brush = gui.addFolder( 'Brush' );
brush.add( set, 'brush_tool', ["WATERCOLOR"] ).name( 'Tool' );
brush.add( set, 'brush_preset', [ 'Watercolor/Bristle', 'Watercolor/Watercolor/Fan', 'Watercolor/Filbert Dry',
                                  'Watercolor/Flat 2', 'Watercolor/Flat Dry', 'Watercolor/Flat', 'Watercolor/Liner 2',
                                  'Watercolor/Liner', 'Watercolor/Mop', 'Watercolor/Round 2', 'Watercolor/Round 3', 
                                  'Watercolor/Round 4', 'Watercolor/Round', 'Watercolor/Wash Flat', 'Watercolor/Wash Round' ] ).name( 'Preset' );
brush.add( set, 'brush_size', 1, 100, 1 ).name( 'Size' );
brush.add( set, 'brush_water', 1, 100, 1 ).name( 'Water' );
brush.add( set, 'brush_opacity', 1, 100, 1 ).name( 'Opacity' ).onChange( setOpacity );
brush.add( set, 'brush_pressure', 1, 100, 1 ).name( 'Pressure' );
brush.add( set, 'brush_dirty_brush').name( 'Dirty brush' );
brush.add( set, 'smudge_only_wet').name( 'Smudge only wet' );
brush.add( set, 'keep_layer_wet').name( 'Keep layer wet' );
brush.add( set, 'keep_water').name( 'Keep water' );
brush.add( set, 'only_water').name( 'Only water' );
brush.add( set, 'brush_paint_type', ["PAINT", "BLEND", "PAINT_BLEND" , "PAINT_MIX", "ERASE"] ).name( 'Paint type' );
brush.add( set, 'brush_glaze_mode', [ "TRANSPARENT", "SEMI-OPAQUE", "OPAQUE"] ).name( 'Glaze mode' );
const bc = brush.addColor( set, 'brush_color', 255 ).name('Color').onChange( setStrokeColor );
bc.domElement.querySelector('input[type="text"]').style.display = 'none';
brush.add( set, 'multi_color_brush').name( 'Multi color brush' );
brush.add( set, 'rotate_multi_color_brush').name( 'Rotate multi color brush' );
brush.add( set, 'smudge').name( 'Smudge' );
brush.add( set, 'spacing', 1, 100, 1 ).name( 'Spacing' );
brush.add( set, 'opacity_multiplier', 1, 10, 1 ).name( 'Opacity multiplier' );

// Set preview paper color 
function setBackgroundColor() {
  const svg = document.getElementById("container").children[0];
  if(!svg)
    return;

  const color = "rgb(" + set.paper_color.r + "," + 
                       + set.paper_color.g + "," + 
                       + set.paper_color.b + ")";
  document.body.style.backgroundColor = color;
  svg.setAttribute("fill", document.body.style.backgroundColor);
}

// Set preview stroke color 
function setStrokeColor() {
  const svg = document.getElementById("container").children[0];
  if(!svg)
    return;
  const color = "rgb(" + set.brush_color.r + "," + 
                       + set.brush_color.g + "," + 
                       + set.brush_color.b + ")";
  svg.setAttribute("stroke", color);
  svg.setAttribute("fill", document.body.style.backgroundColor);
}

// Set stroke opacity
function setOpacity() {
  const svg = document.getElementById("container").children[0];
  if(!svg)
    return;
  svg.setAttribute("opacity", set.brush_opacity / 255);
}

// Traverse object
let x, y, last_x = 0, last_y = 0;
function traverse(obj) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        traverse(value);
      } else {
        if((key=='d') ){
          const segments = parsePath(value);
          segments.forEach(function(s, i) {
            // console.log(`${i}: ${s.key} ${s.data}`); // DEBUG
            if(s.key == 'M') {
              // console.log(s.data);  // DEBUG
              last_x = x;
              last_y = y;
              x = Math.round(s.data[0] * SCALE);
              y = Math.round(s.data[1] * SCALE);
              content +=
`,{ "event_type": "POINTER_RELEASE", "pos": { "x": ${last_x}, "y": ${last_y} }}
,{ "event_type": "POINTER_PRESS",   "pos": { "x": ${x}, "y": ${y} }}
`;
            } else if(s.key == 'L') {
              // console.log(s.data);  // DEBUG
              x = Math.round(s.data[0] * SCALE);
              y = Math.round(s.data[1] * SCALE);
              content +=
`,{ "event_type": "POINTER_MOVE",    "pos": { "x": ${x}, "y": ${y} }}
`;
            }
          });
        }
      }
    }
  }
}

// Parse SVG
function parseSVG() {
  const svg = document.getElementById("container").children[0];
  if(!svg)
    return;
  set.width = svg.getAttribute("width");
  set.height = svg.getAttribute("height");
  guiWidth.updateDisplay();
  guiHeight.updateDisplay();

  const parsed = parse(svg.outerHTML);
  // console.log(parsed);
  traverse(parsed)
}

// Prepare JSON
function makeContent() {
  content = `{"frames":[
{"events":[
{
  "event_type": "NEW_ARTWORK",
  "width": ${set.width},
  "height": ${set.height},
  "units": "${set.units}", 
  "dpi": ${set.dpi},
  "paper": {
      "preset": "Default/${set.paper_preset}",
      "color": { "r": ${set.paper_color.r}, "g": ${set.paper_color.g}, "b": ${set.paper_color.b} },
      "deckled_edges": ${set.paper_deckled_edges},
      "paper_scale": ${set.paper_scale},
      "visible": ${set.paper_visible}
    }
},
{
  "event_type": "SET_BRUSH",
  "tool": "${set.brush_tool}",
  "preset": "${set.brush_preset}",
  "size" : ${set.brush_size},
  "water": ${set.brush_water},
  "opacity": ${set.brush_opacity},
  "pressure": ${set.brush_pressure},
  "brush_dirty_brush": ${set.brush_dirty_brush},
  "smudge_only_wet": ${set.smudge_only_wet},
  "keep_layer_wet": ${set.keep_layer_wet},
  "keep_water": ${set.keep_water},
  "only_water": ${set.only_water},
  "paint_type": "${set.brush_paint_type}",
  "glaze_mode": "${set.brush_glaze_mode}",
  "color": { "r": ${set.brush_color.r}, "g": ${set.brush_color.g}, "b": ${set.brush_color.b} },
  "multi_color_brush": ${set.multi_color_brush},
  "rotate_multi_color_brush": ${set.rotate_multi_color_brush},
  "smudge": ${set.smudge},
  "spacing": ${set.spacing},
  "opacity_multiplier": ${set.opacity_multiplier}
}
,{ "event_type": "POINTER_PRESS",   "pos": { "x": 0, "y": -1 }}
,{ "event_type": "POINTER_MOVE",    "pos": { "x": 0, "y": 0 }}
`;
  parseSVG();
  content +=
`,{ "event_type": "POINTER_RELEASE", "pos": { "x": 0, "y": 0 }}
]}
]}`
}

// Upload
function upload() {
  let form = document.getElementById("form_upload");
  form.style.visibility == "visible" ? form.style.visibility = 'hidden': form.style.visibility = "visible";
}

// Download
const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );

function download() {
  makeContent();
  let filename = "mio.json"
  const blob = new Blob( [ content ], { type: 'text/plain' } );
  link.href = URL.createObjectURL( blob );
  link.download = filename;
  link.click();
}

// Load SVG
function loadSVG(svg) {
  const container = document.getElementById('container');
  fetch(svg)
    .then(response => response.text())
    .then(svgText => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = svgDoc.querySelector('svg');

      if (svgElement && container) {
        container.replaceChildren();
        container.appendChild(svgElement);
        gui.reset();
        setStrokeColor();
        setBackgroundColor();
        parseSVG(); // DEBUG
      }
    });
}
window.loadSVG = loadSVG;