// TODO
//
// 1. Position sketches at the center on load
// 2. Set brush size by stroke_width:
//  {
//     "event_type": "SET_BRUSH_PARAMS",
//     "size": 40,
//     "size_px" : 20, // use either size or size_px
//     "water": 50,
//     "opacity": 80,
//     "pressure": 100,
//     "dirty_brush": true
//  }
//
// 3. Move loadSVG() to svg_painter, use setSVG()
// 4. Remove duplicated events (check)
// 5. Remove unwanted lines (check)
//
import { parse } from '../node_modules/svg-parser/dist/svg-parser.esm.js';
import { parsePath } from '../node_modules/path-data-parser/lib/index.js';
import { set } from './gui.js';

const PORT = "8265";
const SLEEP_TIME = 2000;

let svg;
let x = 0, y = 0, last_x = 0, last_y = 0;
let events = [];
let content;

const container = document.getElementById('container');
const parser = new DOMParser();

// Translate color from HEX/Name to RGBA
function toRGBA(name) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.fillStyle = name;
    context.fillRect(0,0,1,1);
    return context.getImageData(0,0,1,1).data;
}

// Traverse object recursively
let color;
function traverse(obj) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        traverse(value);
      } else {
        if((value=='path') && set.sketch_send_colors){
          const stroke = obj.properties.stroke; // Color
          color = toRGBA(stroke);
          events.push(`{ "event_type": "SET_BRUSH_COLOR", "color": { "r": ${color[0]}, "g": ${color[1]}, "b": ${color[2]} }}`);
        } else if((key=='d') ){
          const segments = parsePath(value); // Path
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

  if(set.artwork_send) {
  events.push(`{
  "event_type": "NEW_ARTWORK",
  "width": ${set.width},
  "height": ${set.height},
  "units": "${set.units}", 
  "dpi": ${set.dpi}
}`);
  }

  if(set.paper_send) {
  events.push(`{
  "event_type": "SET_PAPER",
  "preset": "${set.paper_preset}",
  "color": { "r": ${set.paper_color.r}, "g": ${set.paper_color.g}, "b": ${set.paper_color.b} },
  "deckled_edges": ${set.paper_deckled_edges},
  "paper_scale":  ${set.paper_scale},
  "visible": ${set.paper_visible}
}`);
  }

  if(set.brush_send) {
  events.push(`{
  "event_type": "SET_BRUSH",
  "tool": "${set.brush_tool}",
  "preset": "${set.brush_preset}",
  "size" : ${set.brush_size},
  "water": ${set.brush_water},
  "opacity": ${set.brush_opacity},
  "pressure": ${set.brush_pressure},
  "brush_dirty_brush": ${set.brush_dirty_brush},
  "smudge_only_wet": ${set.smudge_only_wet},
  "keep_layer_wet": ${set.keep_layer_wet},
  "keep_water": ${set.keep_water},
  "only_water": ${set.only_water},
  "paint_type": "${set.brush_paint_type}",
  "glaze_mode": "${set.brush_glaze_mode}",
  "color": { "r": ${set.brush_color.r}, "g": ${set.brush_color.g}, "b": ${set.brush_color.b} },
  "multi_color_brush": ${set.multi_color_brush},
  "rotate_multi_color_brush": ${set.rotate_multi_color_brush},
  "smudge": ${set.smudge},
  "spacing": ${set.spacing},
  "opacity_multiplier": ${set.opacity_multiplier}
}`);
  }

  const parsed = parse(svg.outerHTML);
  // DEBUG
  //events.push(`{ "event_type": "POINTER_PRESS",   "pos": { "x": 0, "y": -1 }}`);
  //events.push(`{ "event_type": "POINTER_MOVE",    "pos": { "x": 0, "y": 0 }}`);
  traverse(parsed);
  events.push(`{ "event_type": "POINTER_RELEASE", "pos": { "x": ${last_x}, "y": ${last_y} }}`);
  // console.log(events); // DEBUG
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

// Download
const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );

export function saveEvents() {
  makeEvents();
  makeContent();
  let filename = "events.json"
  const blob = new Blob( [ content ], { type: 'text/plain' } );
  link.href = URL.createObjectURL( blob );
  link.download = filename;
  link.click();
}

// Load SVG
function loadSVG(file) {
  fetch(file)
    .then(response => response.text())
    .then(svgText => {
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      svg = svgDoc.querySelector('svg');
      if (svg && container) {
        container.replaceChildren();
        container.appendChild(svg);
        svg.setAttribute("fill", "#fff");
        svg.setAttribute("stroke", "#000");
      }
    });
}
window.loadSVG = loadSVG;

// Set SVG
function setSVG(text) {
  const svgDoc = parser.parseFromString(text, 'image/svg+xml');
  svg = svgDoc.querySelector('svg');
  svg.setAttribute("fill", "#fff");
  svg.setAttribute("stroke", "#000");

  container.replaceChildren();
  container.appendChild(svg);
}
window.setSVG = setSVG;

// Sleep for websocket
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Paint
export async function paint() {
  makeEvents();
  const socket = new WebSocket('ws://localhost:' + PORT);
  socket.onopen = async (event) => {
    setStatus('Connected to server');
    for(let i=0; i<events.length; i++){
      // console.log(events[i]); // DEBUG
      socket.send(events[i]);
      if(events[i].includes("NEW_ARTWORK") || // TODO: Remove after EM's fix
         events[i].includes("SET_PAPER")   ||
         events[i].includes("SET_BRUSH")   ||
         events[i].includes("SET_BRUSH_COLOR")) {
         await sleep(SLEEP_TIME);
      }
    }
    socket.close(1000, "Sending complete");
  };

  socket.onmessage = (event) => {
    setStatus('Message from server: ' + event.data);
  };

  socket.onerror = (error) => {
    setStatus('WebSocket Error: ' + error);
  };

  socket.onclose = (event) => {
    if (event.wasClean) {
      setStatus(`Connection closed cleanly, Code:${event.code}, Reason: ${event.reason}`);
    } else {
      setStatus('Connection died');
    }
  };
}
window.paint = paint;

// Set status
let stat = document.getElementById("status");
function setStatus(s) {
    stat.innerHTML = s;
}
window.setStatus = setStatus;
