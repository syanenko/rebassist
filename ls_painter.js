// TODO
//
// 0. Write "Save SVG".
// 1. Add "Render" to GUI.
// 2. Position sketches at the center on load.
// 3. Show overlay on Load, make set of LS.
// 4. Set brush size by stroke_width.
// 5. Validate JS in editor window (?).
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

// Set status
let stat = document.getElementById("status");
function setStatus(s) {
    stat.innerHTML = s;
    console.log(s);
}
window.setStatus = setStatus;
