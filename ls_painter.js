// TODO
//
// -- Test ws connection after loading app from yesbird.online
// -- Read file with readFile();
//    https://developer.mozilla.org/en-US/docs/Web/API/File_System_API
//
// 1. Write "Save SVG" method.
// 2. Add "Refresh" to GUI: https://fonts.google.com/icons?icon.query=refresh&icon.size=24&icon.color=000000
// 3. Position sketches at the center on load.
// 4. Set brush size by stroke_width.
// 5. Validate JS in editor window (?).
//
// -- Pro version:
//  https://github.com/nylki/lindenmayer
//  https://codepen.io/nylki/pen/bpzrex
//  http://nylki.github.io/lindenmayer/examples/interactive_lsystem_builder/index.html
//
// 1. Push 'finals' in object after editing - before iterate() and final().
// 
import { guiInit, gui } from './modules/gui.js';
import { saveEvents, paint } from './modules/painter.js';

guiInit(paint, saveEvents, saveSVG, saveLS, false);

// Save L-System
const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );

function saveLS() {
  const blob = new Blob( [ editor.getValue() ], { type: 'text/plain' } );
  link.href = URL.createObjectURL( blob );
  link.download = "lsystem.mjs"
  link.click();
}
window.saveLS = saveLS;

// Save SVG
function saveSVG() {
  console.log("saveSVG()");
}
