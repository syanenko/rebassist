import { guiInit, gui } from './modules/gui.js';
import { saveEvents, paint } from './modules/painter.js';

guiInit(paint, saveEvents, null, null, true);

// Load SVG
function loadSVG(file) {
  fetch(file)
    .then(response => response.text())
    .then(text => {
      setTextSVG (text);
      // console.log(text);
    });
}
window.loadSVG = loadSVG;

// Load file with picker
async function loadSVGPicker() {
  try {
    const [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    const text = await file.text();
    setTextSVG(text);
    // console.log(text);
  } catch(err) {
    // console.error(err);
  }
}
window.loadSVGPicker = loadSVGPicker;
