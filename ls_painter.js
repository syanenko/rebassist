// TODO
//
// 0. Check loadSVG()
// 1. Actions: Load, Save, Export SVG, Export events, Render, Paint.
// 2. Show overlay on Load, make set of LS.
// 3. Get menu and paint module from SVG Painter
// 4. Validate JS in editor window (?).
//
import { guiInit } from './modules/gui.js';
import { saveEvents, paint } from './modules/painter.js';

guiInit(paint, saveEvents);

// Save
const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );

function save() {
  const blob = new Blob( [ editor.getValue() ], { type: 'text/plain' } );
  link.href = URL.createObjectURL( blob );
  link.download = "lsystem.mjs"
  link.click();
}
window.save = save;

// Set status
let stat = document.getElementById("status");
function setStatus(s) {
    stat.innerHTML = s;
    console.log(s);
}
window.setStatus = setStatus;
