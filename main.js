// TODO:
//
// 1. Studio links icons
// 2. Convert sources to paths
// 3. Parse and download
// 4. GUI with settings
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
  paper_r: 255,
  paper_g: 255,
  paper_b: 255,
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

  brush_r: 255,
  brush_g: 255,
  brush_b: 255,

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
paper.add( set, 'paper_r', 0, 255, 1 ).name( 'Red' );
paper.add( set, 'paper_g', 0, 255, 1 ).name( 'Green' );
paper.add( set, 'paper_b', 0, 255, 1 ).name( 'Blue' );
paper.add( set, 'paper_deckled_edges', 64, 1024, 1 ).name( 'Deckled edges' );
paper.add( set, 'paper_scale', 1, 200, 1 ).name( 'Scale' );

// Paper
const brush = gui.addFolder( 'Brush' );
brush.add( set, 'brush_tool', ["WATERCOLOR"] ).name( 'Tool' );
brush.add( set, 'brush_preset', [ 'Default/HM01 Handmade', 'Default/HM02 Handmade 2' ] ).name( 'Preset' );
brush.add( set, 'brush_size', 1, 128, 1 ).name( 'Size' );
brush.add( set, 'brush_water', 1, 128, 1 ).name( 'Water' );
brush.add( set, 'brush_opacity', 1, 128, 1 ).name( 'Opacity' );
brush.add( set, 'brush_paint_type', ["PAINT"] ).name( 'Paint type' );
brush.add( set, 'brush_glaze_mode', ["OPAQUE"] ).name( 'Glaze mode' );

brush.add( set, 'brush_r', 0, 255, 1 ).name( 'Red' );
brush.add( set, 'brush_g', 0, 255, 1 ).name( 'Green' );
brush.add( set, 'brush_b', 0, 255, 1 ).name( 'Blue' );

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
      "color": { "r": ${set.paper_r}, "g": ${set.paper_g}, "b": ${set.paper_b} },
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
  "color": { "r": ${set.brush_r}, "g": ${set.brush_g}, "b": ${set.brush_b} }
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
