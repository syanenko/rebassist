// TODO:
// 1. Send to WS
//
import { GUI } from '/node_modules/lil-gui/dist/lil-gui.esm.min.js';
import { parse } from '/node_modules/svg-parser/dist/svg-parser.esm.js';
import { parsePath } from './node_modules/path-data-parser/lib/index.js';

const PORT = "8265";

let svg;
let x = 0, y = 0, last_x = 0, last_y = 0;
let events = [];
let content;

// GUI
const set = {
  paper_color: { r: 255, g: 255, b: 255},
  brush_color: { r: 0, g: 0, b: 0},
  scale: 1,
  trans_x: 0,
  trans_y: 0,
  paint()    {paint()},
  save() {save()}
};

// const gui = new GUI( {width: 350, title:"Control", closeFolders:true} );
// gui.domElement.querySelector('.title').style.color = "hsl(205 61% 65%)";

// Buttons
// gui.add( set, 'scale', 0.1, 20, 0.1 ).name( 'Scale' ).onFinishChange( onSetChange );
// gui.add( set, 'trans_x', -2048, 2048, 1 ).name( 'X tanslate' ).onFinishChange( onSetChange );
// gui.add( set, 'trans_y', -2048, 2048, 1 ).name( 'Y tanslate' ).onFinishChange( onSetChange );
// gui.add( set, 'paint' ).name( 'Paint' );
// gui.add( gui.reset(), 'reset' ).name( 'Reset' );
// gui.add( set, 'save' ).name( 'Save' );

// On changing the scale
function onSetChange() {
  makeEvents();
  // paint();
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
              x = Math.round(s.data[0] * set.scale) + set.trans_x;
              y = Math.round(s.data[1] * set.scale) + set.trans_y;
              events.push(`{ "event_type": "POINTER_RELEASE", "pos": { "x": ${last_x}, "y": ${last_y} }}`);
              events.push(`{ "event_type": "POINTER_PRESS",   "pos": { "x": ${x}, "y": ${y} }}`);
            } else if(s.key == 'L') {
              x = Math.round(s.data[0] * set.scale) +  set.trans_x;
              y = Math.round(s.data[1] * set.scale) +  set.trans_y;
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
  content = '[\n';
  const len =  events.length-1;
  for(let i=0; i<len; i++) {
    content += (events[i] + ',\n');
  };
  content += (events[len] + '\n');
  content += ']';
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

function save() {
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
let status = document.getElementById("status");
function setStatus(s) {
    s = 'Status: ' + s;
    status.innerHTML = s;
    console.log(s);
}
window.setStatus = setStatus;

function paint() {
  const socket = new WebSocket('ws://localhost:' + PORT);
  socket.onopen = (event) => {
    setStatus('Connected to server') 
    for(let i=0; i<events.length; i++){
      console.log(events[i]); // DEBUG
      socket.send(events[i]);
    }
    socket.close(1000, "Work complete");
  };

  socket.onmessage = (event) => {
    setStatus(`Message from server: ${event.data}`);
  };

  socket.onerror = (error) => {
    setStatus(`WebSocket Error: ${error}`);
  };

  socket.onclose = (event) => {
    if (event.wasClean) {
      setStatus(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
    } else {
      setStatus(`Connection died, code=${event.code}`);
    }
  };
}
window.paint = paint;
