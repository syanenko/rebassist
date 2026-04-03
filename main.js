// TODO
// 1. Remove unwanted lines
// 2. Pre-defined slots (sketches)
//
import { GUI } from './node_modules/lil-gui/dist/lil-gui.esm.min.js';
import { parse } from './node_modules/svg-parser/dist/svg-parser.esm.js';
import { parsePath } from './node_modules/path-data-parser/lib/index.js';

let svg;
let x = 0, y = 0, last_x = 0, last_y = 0;
let events = [];
let content;
const PORT = "8265";

// GUI
const set = {
  paper_color: { r: 255, g: 255, b: 255},
  brush_color: { r: 0, g: 0, b: 0},
  scale: 5,
  paint()     {paint()},
  download() {download()}
};

const gui = new GUI( {width: 350, title:"Control", closeFolders:true} );
// gui.domElement.querySelector('.title').style.color = "hsl(205 61% 65%)";

// Buttons
gui.add( set, 'scale', 1, 20, 0.1 ).name( 'Scale' ).onFinishChange( onScaleChange );
gui.add( set, 'paint' ).name( 'Paint' );
// gui.add( set, 'download' ).name( 'Download' );

// On changing the scale
function onScaleChange() {
  makeEvents();
  paint();
}

// Traverse object recursively
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
              last_x = x;
              last_y = y;
              x = Math.round(s.data[0] * set.scale);
              y = Math.round(s.data[1] * set.scale);
              events.push(`{ "event_type": "POINTER_RELEASE", "pos": { "x": ${last_x}, "y": ${last_y} }}`);
              events.push(`{ "event_type": "POINTER_PRESS",   "pos": { "x": ${x}, "y": ${y} }}`);
            } else if(s.key == 'L') {
              x = Math.round(s.data[0] * set.scale);
              y = Math.round(s.data[1] * set.scale);
              events.push(`{ "event_type": "POINTER_MOVE",    "pos": { "x": ${x}, "y": ${y} }}`);
            }
          });
        }
      }
    }
  }
}

// Make events
function makeEvents() {
  events.length = 0; // Empty events
  const parsed = parse(svg.outerHTML);

  // DEBUG
  //events.push(`{ "event_type": "POINTER_PRESS",   "pos": { "x": 0, "y": -1 }}`);
  //events.push(`{ "event_type": "POINTER_MOVE",    "pos": { "x": 0, "y": 0 }}`);
  traverse(parsed);
  events.push(`{ "event_type": "POINTER_RELEASE", "pos": { "x": ${last_x}, "y": ${last_y} }}`);
}

// Make JSON
function makeContent() {
  // Make content
  content = '{"frames":[\n{"events":[\n';
  const len =  events.length-1;
  for(let i=0; i<len; i++) {
    content += (events[i] + ',\n');
  };
  content += (events[len] + '\n');
  content += ']}\n]}\n';
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
  let filename = "MotioIO.json"
  const blob = new Blob( [ content ], { type: 'text/plain' } );
  link.href = URL.createObjectURL( blob );
  link.download = filename;
  link.click();
}

// Load SVG
function loadSVG(file) {
  const container = document.getElementById('container');
  fetch(file)
    .then(response => response.text())
    .then(svgText => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = svgDoc.querySelector('svg');

      if (svgElement && container) {
        svg = svgElement;
        container.replaceChildren();
        container.appendChild(svgElement);
        gui.reset();
        svg.setAttribute("fill", "#fff");
        svg.setAttribute("stroke", "#000");
        makeEvents();
      }
    });
}
window.loadSVG = loadSVG;

//
// Websocket
// const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// await sleep(1);
//
// Paint
function paint() {
  const socket = new WebSocket('ws://localhost:' + PORT);
  socket.onopen = (event) => {
    console.log('Connected to server');
    for(let i=0; i<events.length; i++){
      // console.log(events[i]);
      socket.send(events[i]);
    }
    socket.close(1000, "Work complete"); 
  };

  socket.onmessage = (event) => {
    console.log('Message from server:', event.data);
  };

  socket.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };

  socket.onclose = (event) => {
    if (event.wasClean) {
      console.log(`Closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      console.log('Connection died');
    }
  };
}
