// TODO
//
// 1. Position sketches at the center on load.
// 2. SVG thumbnails as in SVG painter.
// 3. Check shotcuts.
// 4. About
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
import { guiInit, set } from './modules/gui.js';
import { saveEvents, paint, calcPosition } from './modules/painter.js';

set.paper_visible = true
set.paper_deckled_edges = false;
guiInit(paint, saveEvents, saveSVG, null, calcPosition, false);

// Link
const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );

// Save L-System
function saveLS() {
  const blob = new Blob( [ editor.getValue() ], { type: 'text/javascript' } );
  link.href = URL.createObjectURL( blob );
  link.download = "lsystem.ls"
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
