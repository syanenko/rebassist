// TODO
//
// 1. "Save SVG" method.
// 2. Control icons.
// 3. Position sketches at the center on load.
// 4. Set brush size by stroke_width.
// 5. Test ws connection after loading app from yesbird.online.
// 6. Check shotcuts.
// 7. Validate JS in editor window (?).
//
// -- Pro version:
//  https://github.com/nylki/lindenmayer
//  https://codepen.io/nylki/pen/bpzrex
//  http://nylki.github.io/lindenmayer/examples/interactive_lsystem_builder/index.html
//
// 1. Make 'finals' for HTML canvas (2D - default), Three.js (3D), Rebelle (Painter),
//    push 'finals' in object after editing - before iterate() and final().
// 2. Interface: Load, Save, 2D, 3D, Painter (GUI), Preview Thumbnails.
//
import { guiInit, gui } from './modules/gui.js';
import { saveEvents, paint } from './modules/painter.js';

guiInit(paint, saveEvents, saveSVG, null, false);

// Link
const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );

// Save L-System
function saveLS() {
  const blob = new Blob( [ editor.getValue() ], { type: 'text/plain' } );
  link.href = URL.createObjectURL( blob );
  link.download = "lsystem.mjs"
  link.click();
}
window.saveLS = saveLS;

// Save SVG
function saveSVG() {
  const svg = document.getElementById('container').firstElementChild;
  const blob = new Blob( [svg.outerHTML], { type: 'text/plain' } );
  link.href = URL.createObjectURL( blob );
  link.download = "lsystem.svg"
  link.click();
}
window.saveSVG = saveSVG;
