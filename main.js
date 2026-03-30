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
  dpi: 200,
  // Paper
  r: 255,
  g: 255,
  b: 255,
  deckled_edges: true,
  scale: 150,
};

const gui = new GUI( {width: 300, title:"Settings", closeFolders:true} );
// Artwork 
gui.add( set, 'width', 64, 1024, 1 ).name( 'Width' );
gui.add( set, 'height', 64, 1024, 1 ).name( 'Heght' );
gui.add( set, 'dpi', 72, 600, 1 ).name( 'DPI' );

// Paper
gui.add( set, 'r', 0, 255, 1 ).name( 'Red' );
gui.add( set, 'g', 0, 255, 1 ).name( 'Green' );
gui.add( set, 'b', 0, 255, 1 ).name( 'Blue' );
gui.add( set, 'deckled_edges', 64, 1024, 1 ).name( 'Deckled edges' );
gui.add( set, 'scale', 1, 200, 1 ).name( 'Scale' );

gui.add( gui.reset(), 'reset' ).name( 'Reset' );

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
  "units": "px",
  "dpi": ${set.dpi},
  "paper": {
      "preset": "Default/HM01 Handmade",
      "color": { "r": ${set.r}, "g": ${set.g}, "b": ${set.b} },
      "deckled_edges": ${set.deckled_edges},
      "paper_scale": ${set.scale}
  }
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
