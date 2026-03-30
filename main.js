// TODO:
//
// 1. Colorize GUI
// 2. Color selector in GUI
// 3. Parse SVG and paths
// 4. Convert sources to paths
//
import { GUI } from '/node_modules/lil-gui/dist/lil-gui.esm.min.js';

let content;

// GUI
const set = {
  // Artwork
  width: 800,
  height: 600,
  units: "px",
  dpi: 200,

  // Paper
  paper_preset: "Default/HM01 Handmade",
  paper_color: { r: 0, g: 0, b: 0},
  paper_deckled_edges: true,
  paper_scale: 150,

  // Brush
  brush_tool: "WATERCOLOR",
  brush_preset: "Gouache/Gouache Filbert",
  brush_size : 40,
  brush_water: 55,
  brush_opacity: 10,
  brush_paint_type: "PAINT",
  brush_glaze_mode: "OPAQUE",
  brush_color: { r: 0, g: 0, b: 0},

  // Download
  download() {download()}
};

const gui = new GUI( {width: 300, title:"Settings"} );
// Artwork 
const artwork = gui.addFolder( 'Artwork' );
artwork.add( set, 'width', 64, 1024, 1 ).name( 'Width' );
artwork.add( set, 'height', 64, 1024, 1 ).name( 'Heght' );
artwork.add( set, 'units', [ 'px', 'mm' ] ).name( 'Units' );
artwork.add( set, 'dpi', 72, 600, 1 ).name( 'DPI' );

// Paper
const paper = gui.addFolder( 'Paper' );
paper.add( set, 'paper_preset', [ 'Default/HM01 Handmade', 'Default/HM02 Handmade 2' ] ).name( 'Preset' );
const pc = paper.addColor( set, 'paper_color', 255 ).name('Color');
pc.domElement.querySelector('input[type="text"]').style.display = 'none';
paper.add( set, 'paper_deckled_edges', 64, 1024, 1 ).name( 'Deckled edges' );
paper.add( set, 'paper_scale', 1, 200, 1 ).name( 'Scale' );

// Brush
const brush = gui.addFolder( 'Brush' );
brush.add( set, 'brush_tool', ["WATERCOLOR"] ).name( 'Tool' );
brush.add( set, 'brush_preset', [ 'Default/HM01 Handmade', 'Default/HM02 Handmade 2' ] ).name( 'Preset' );
brush.add( set, 'brush_size', 1, 128, 1 ).name( 'Size' );
brush.add( set, 'brush_water', 1, 128, 1 ).name( 'Water' );
brush.add( set, 'brush_opacity', 1, 128, 1 ).name( 'Opacity' );
brush.add( set, 'brush_paint_type', ["PAINT"] ).name( 'Paint type' );
brush.add( set, 'brush_glaze_mode', ["OPAQUE"] ).name( 'Glaze mode' );
const bc = brush.addColor( set, 'brush_color', 255 ).name('Color');
bc.domElement.querySelector('input[type="text"]').style.display = 'none';

// Buttons
gui.add( gui.reset(), 'reset' ).name( 'Reset' );
gui.add( set, 'download' ).name( 'Download' );

// Download
const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );

// Prepare JSON
function makeContent() {
  const width = 512;
  const height = 212;
  content = `{"frames":[
{"events":[
{
  "event_type": "NEW_ARTWORK",
  "width": ${set.width},
  "height": ${set.height},
  "units": "${set.units}", 
  "dpi": ${set.dpi},
  "paper": {
      "preset": "${set.paper_preset}",
      "color": { "r": ${set.paper_color.r}, "g": ${set.paper_color.g}, "b": ${set.paper_color.b} },
      "deckled_edges": ${set.paper_deckled_edges},
      "paper_scale": ${set.paper_scale}
    }
},
{
  "event_type": "SET_BRUSH",
  "tool": "${set.brush_tool}",
  "preset": "${set.brush_preset}",
  "size" : ${set.brush_size},
  "water": ${set.brush_water},
  "opacity": ${set.brush_opacity},
  "paint_type": "${set.brush_paint_type}",
  "glaze_mode": "${set.glaze_mode}",
  "color": { "r": ${set.brush_color.r}, "g": ${set.brush_color.g}, "b": ${set.brush_color.b} }
}
]}
]}`
}

// Download
function download() {
  makeContent();
  let filename = "mio.json"
  const blob = new Blob( [ content ], { type: 'text/plain' } );
  link.href = URL.createObjectURL( blob );
  link.download = filename;
  link.click();
}
window.download = download;
