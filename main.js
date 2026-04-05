// TODO
//
// 1. Position sketches at the center on load 
// 2. Artworks presets
// 3. Remove duplicated events (check)
// 4. Remove unwanted lines (check)
// 5. Use stroke width (?)
// 6. Embed https://amphiluke.github.io/lindsvg/
//
import { GUI } from './node_modules/lil-gui/dist/lil-gui.esm.min.js';
import { parse } from './node_modules/svg-parser/dist/svg-parser.esm.js';
import { parsePath } from './node_modules/path-data-parser/lib/index.js';

const PORT = "8265";
const SLEEP_TIME = 2000;
const colorTitle = "hsl(205 61% 65%)";

let svg;
let x = 0, y = 0, last_x = 0, last_y = 0;
let events = [];
let content;

// GUI
const set = {
  // Artwork
  artwork_send: true,
  width: 1024,
  height: 1024,
  units: "px",
  dpi: 200,

  // Paper
  paper_send: true,
  paper_preset: "Default/RH00 Aquarelle",
  paper_color: { r: 255, g: 255, b: 255},
  paper_deckled_edges: true,
  paper_scale: 100,
  paper_visible: true,

  // Brush
  brush_send: true,
  brush_tool: "WATERCOLOR",
  brush_preset: "Watercolor/Liner",
  brush_size : 4,
  brush_water: 1,
  brush_opacity: 100,
  brush_pressure: 100,
  brush_dirty_brush: false,
  smudge_only_wet: false,
  keep_layer_wet: false,
  keep_water: false,
  only_water: false,

  brush_paint_type: "PAINT",
  brush_glaze_mode: "OPAQUE",
  brush_color: { r: 48, g: 136, b: 199},
  multi_color_brush: true,
  rotate_multi_color_brush: true,
  smudge: true,  
  spacing: 50,
  opacity_multiplier: 2,

  // Sketch
  sketch_send_colors: true,
  scale: 1,
  trans_x: 0,
  trans_y: 0,

  // Buttons
  paint() {paint()},
  save()  {save()}
};

const gui = new GUI( {width: 350, title:"Control", closeFolders:true} );
gui.domElement.querySelector('.title').style.color = "hsl(205 61% 65%)";

// Artwork 
const artwork = gui.addFolder( 'Artwork' );
artwork.domElement.querySelector('.title').style.color = colorTitle;
artwork.add( set, 'artwork_send' ).name( 'Send' );
artwork.add( set, 'width', 1, 32000, 1 ).name( 'Width' );
artwork.add( set, 'height', 1, 32000, 1 ).name( 'Heght' );

//  Only 'px' supported, need to check scale in Inkscape 
artwork.add( set, 'units', [ 'px' ] ).name( 'Units' ); // [ 'px', 'cm', 'in' ]
artwork.add( set, 'dpi', [ '72', '96', '100', '150', '200', '250', '300', '400', '600' ] ).name( 'DPI' );

// Paper
const paper = gui.addFolder( 'Paper' );
paper.domElement.querySelector('.title').style.color = colorTitle;
paper.add( set, 'paper_send' ).name( 'Send' );
paper.add( set, 'paper_preset', [ 'Default/EX00 White Simple', 'Default/CA01 Canvas Artist', 'Default/HP01 Hot Pressed', 'Default/RH00 Aquarelle', 'Default/WK01 Washi' ] ).name( 'Preset' );
const pc = paper.addColor( set, 'paper_color', 255 ).name('Color').onChange( setBackgroundColor );
pc.domElement.querySelector('input[type="text"]').style.display = 'none';
paper.add( set, 'paper_deckled_edges', 64, 1024, 1 ).name( 'Deckled edges' );
paper.add( set, 'paper_scale', 10, 400, 10 ).name( 'Scale' );
paper.add( set, 'paper_visible' ).name( 'Visible' );

// Brush
const brush = gui.addFolder( 'Brush' );
brush.domElement.querySelector('.title').style.color = colorTitle;
brush.add( set, 'brush_send' ).name( 'Send' );
brush.add( set, 'brush_tool', ["WATERCOLOR"] ).name( 'Tool' );
brush.add( set, 'brush_preset', [ 'Watercolor/Bristle', 'Watercolor/Watercolor/Fan', 'Watercolor/Filbert Dry',
                                  'Watercolor/Flat 2', 'Watercolor/Flat Dry', 'Watercolor/Flat', 'Watercolor/Liner 2',
                                  'Watercolor/Liner', 'Watercolor/Mop', 'Watercolor/Round 2', 'Watercolor/Round 3', 
                                  'Watercolor/Round 4', 'Watercolor/Round', 'Watercolor/Wash Flat', 'Watercolor/Wash Round' ] ).name( 'Preset' );
brush.add( set, 'brush_size', 1, 100, 1 ).name( 'Size' );
brush.add( set, 'brush_water', 1, 100, 1 ).name( 'Water' );
brush.add( set, 'brush_opacity', 1, 100, 1 ).name( 'Opacity' ).onChange( setOpacity );
brush.add( set, 'brush_pressure', 1, 100, 1 ).name( 'Pressure' );
brush.add( set, 'brush_dirty_brush').name( 'Dirty brush' );
brush.add( set, 'smudge_only_wet').name( 'Smudge only wet' );
brush.add( set, 'keep_layer_wet').name( 'Keep layer wet' );
brush.add( set, 'keep_water').name( 'Keep water' );
brush.add( set, 'only_water').name( 'Only water' );
brush.add( set, 'brush_paint_type', ["PAINT", "BLEND", "PAINT_BLEND" , "PAINT_MIX", "ERASE"] ).name( 'Paint type' );
brush.add( set, 'brush_glaze_mode', [ "TRANSPARENT", "SEMI-OPAQUE", "OPAQUE"] ).name( 'Glaze mode' );
const bc = brush.addColor( set, 'brush_color', 255 ).name('Color').onChange( setStrokeColor );
bc.domElement.querySelector('input[type="text"]').style.display = 'none';
brush.add( set, 'multi_color_brush').name( 'Multi color brush' );
brush.add( set, 'rotate_multi_color_brush').name( 'Rotate multi color brush' );
brush.add( set, 'smudge').name( 'Smudge' );
brush.add( set, 'spacing', 1, 100, 1 ).name( 'Spacing' );
brush.add( set, 'opacity_multiplier', 1, 10, 1 ).name( 'Opacity multiplier' );

// Sketch
const sketch = gui.addFolder( 'Sketch' );
sketch.domElement.querySelector('.title').style.color = colorTitle;
sketch.add( set, 'sketch_send_colors').name( 'Send colors' );
sketch.add( set, 'scale', 0.1, 20, 0.1 ).name( 'Scale' );
sketch.add( set, 'trans_x', -2048, 2048, 1 ).name( 'X tanslate' );
sketch.add( set, 'trans_y', -2048, 2048, 1 ).name( 'Y tanslate' );

// Controls
gui.add( gui.reset(), 'reset' ).name( 'Reset' );
gui.add( set, 'paint' ).name( 'Paint' );
gui.add( set, 'save' ).name( 'Save' );

// Set preview paper color 
function setBackgroundColor() {
  const svg = document.getElementById("container").children[0];
  if(!svg)
    return;

  const color = "rgb(" + set.paper_color.r + "," + 
                       + set.paper_color.g + "," + 
                       + set.paper_color.b + ")";
  document.body.style.backgroundColor = color;
  svg.setAttribute("fill", document.body.style.backgroundColor);
}

// Set preview stroke color 
function setStrokeColor() {
  const svg = document.getElementById("container").children[0];
  if(!svg)
    return;
  const color = "rgb(" + set.brush_color.r + "," + 
                       + set.brush_color.g + "," + 
                       + set.brush_color.b + ")";
  svg.setAttribute("stroke", color);
  svg.setAttribute("fill", document.body.style.backgroundColor);
}

// Set stroke opacity
function setOpacity() {
  const svg = document.getElementById("container").children[0];
  if(!svg)
    return;
  svg.setAttribute("opacity", set.brush_opacity / 255);
}

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

function save() {
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
  const container = document.getElementById('container');
  fetch(file)
    .then(response => response.text())
    .then(svgText => {
      const parser = new DOMParser();
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

// Sleep for websocket
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Paint
async function paint() {
  makeEvents();
  const socket = new WebSocket('ws://localhost:' + PORT);
  socket.onopen = async (event) => {
    console.log('Connected to server');
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
