// TODO
//
// 1. Paint function
// 2. Add Paint GUI
// 3. Paint directly to MIO
// 4. Export SVG via custom exporter (without colors ?)
//
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';
import { GUI } from '/node_modules/lil-gui/dist/lil-gui.esm.min.js';
import { presets } from './modules/attractors.js';

import { set } from './modules/gui.js';

// Helpers
let help = false;
// let help = true;

// Common
let container;
let camera, scene, renderer, svgRenderer;
let ocontrols;
let line;
let gui;
const colorTitle = "hsl(205 61% 65%)";

// Preset
let current = 1;

// Paint
let events = [];
const PORT = "8265";
const SLEEP_TIME = 2000;

//
// Init
//
async function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.01, 1000 );
  camera.position.set( 0, 2.5, 4.2 );

  scene.add( camera );

  // Helpers
  if(help) {
    let o = new THREE.Vector3(0,0,0);
    let x = new THREE.Vector3(1,0,0);
    let y = new THREE.Vector3(0,1,0);
    let z = new THREE.Vector3(0,0,1);
//     scene.add( new THREE.GridHelper( 2, 20 ) );
    scene.add( new THREE.ArrowHelper(x,o,2,'crimson') );
    scene.add( new THREE.ArrowHelper(y,o,2,'green') );
    scene.add( new THREE.ArrowHelper(z,o,2,'royalblue') );
  }

  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  svgRenderer = new SVGRenderer();
  svgRenderer.setSize(640, 480);
  svgRenderer.setClearColor( 0x222222 );
  container = document.getElementById("container");
  container.appendChild( svgRenderer.domElement );

  //renderer.setPixelRatio( window.devicePixelRatio );
	document.body.appendChild( renderer.domElement );

  // TODO: Check it
  // renderer.toneMapping = THREE.LinearToneMapping;
  // renderer.toneMappingExposure = 0.8;

  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.VSMShadowMap;

  // Init orbit controlls
  ocontrols = new OrbitControls( camera, renderer.domElement );
  ocontrols.enablePan = true;
  ocontrols.autoRotate = true; 

  initGUI();
  initLights(5.5);
  loadPreset(current);

  window.addEventListener( 'resize', onWindowResize );
}

// Attractors
function makeAttractor() {

  const points = [];

  let colors = new Float32Array(presets[0].N * 3);
  const divColors = 0.00002;
  // const divColors = 0.0002;

  let  a = presets[0].A;
  let  b = presets[0].B;
  let  c = presets[0].C;
  let  h = presets[0].H;

  let x0 = presets[0].x0;
  let y0 = presets[0].y0;
  let z0 = presets[0].z0;
  let x1, y1, z1;

  for (let i=0; i<presets[0].N; i++) {
    x1 = presets[0].x(x0, y0, z0, a, b, c, h);
    y1 = presets[0].y(x0, y0, z0, a, b, c, h);
    z1 = presets[0].z(x0, y0, z0, a, b, c, h);
    x0 = x1;
    y0 = y1;
    z0 = z1;
    points.push( new THREE.Vector3( x0, y0, z0 ) );

    colors[i * 3]     = Math.abs(i / (y0 / x0)) * divColors;
    colors[i * 3 + 1] = Math.abs(i / (y0 / z0)) * divColors;
    colors[i * 3 + 2] = Math.abs(i / (z0 / x0)) * divColors;
  }

  const material = new THREE.LineBasicMaterial( { opacity: 1, transparent: false, vertexColors: true/*, color: 0x00ff00, linewidth: 1*/} );
  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  // geometry.scale(0.04, 0.04, 0.04);
  geometry.scale(presets[0].scale, presets[0].scale, presets[0].scale);
  geometry.translate(0,0,-1);

  if(line) {
    scene.remove(line);
    line.geometry.dispose();
    line.material.dispose();
    line = null;
   }

  line = new THREE.Line( geometry, material );
  scene.add( line );
}

// Init GUI
function initGUI()
{
  // GUI
  gui = new GUI( {width: 300, title:"Lorenz attractor", closeFolders:false} );
  gui.domElement.querySelector('.title').style.color = colorTitle;
/*
  gui.add( presets[0], 'env', 1, 6, 1 ).name( 'Env' ).onChange(  makeAttractor );
  gui.add( presets[0], 'r', 0, 1, 0.01 ).name( 'Red' ).onChange(  makeAttractor );
  gui.add( presets[0], 'g', 0, 1, 0.01 ).name( 'Green' ).onChange(  makeAttractor );
  gui.add( presets[0], 'b', 0, 1, 0.01 ).name( 'Blue' ).onChange(  makeAttractor );
*/
  gui.add( presets[0], 'A', 1, 20, 0.01).name( 'A' ).onChange(  makeAttractor );
  gui.add( presets[0], 'B', 0.001, 30, 0.001).name( 'B' ).onChange(  makeAttractor );
  gui.add( presets[0], 'C', 0, 10, 0.01).name('C').onChange(  makeAttractor );
  gui.add( presets[0], 'H', 0, 0.015, 0.0001).name( 'H' ).onChange(  makeAttractor );
  gui.add( presets[0], 'N', 10, 50000, 1).name( 'N' ).onChange(  makeAttractor );
/*
  gui.add( presets[0], 'fastChroma').name( 'Fast CA' ).onChange(  makeAttractor );
  gui.add( presets[0], 'antialias').name( 'Antialis SMAA' ).onChange(  makeAttractor );
  gui.add( presets[0], 'gamma').name( 'Gamma correction' ).onChange(  makeAttractor );
*/

  gui.add( presets[0], 'scale', 0.001, 20, 0.001).name( 'Scale' ).onChange( makeAttractor );
  gui.add( presets[0], 'speed', -5, 5, 1 ).name( 'Rotate' );
  gui.add( gui.reset(), 'reset' ).name( 'Reset' ).onChange( loadPreset );
  gui.add( { exportSVG }, 'exportSVG' ).name( 'Export SVG' ); // TODO
  gui.add( { exportMIO }, 'exportMIO' ).name( 'Export MIO' );

  // Set colors
  // gui.controllers[1].$name.style.color = "#ff0000";
  // gui.controllers[2].$name.style.color = "#00ff00";
  // gui.controllers[3].$name.style.color = "#0000ff";
  // gui.controllers[12].$name.style.color = "#ff9127";
}

// Load presets
function loadPreset(index) {
  if(!Number.isInteger(index))
    index = current;
  current = index;

  Object.assign(presets[0], presets[index]);
  gui.title(presets[0].name);
  for (var i in gui.controllers)
    gui.controllers[i].updateDisplay();

  makeAttractor();
  ocontrols.reset();
}
window.loadPreset = loadPreset;

// Export SVG
const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );

function exportSVG() {
  console.log("Export SVG()");
  svgRenderer.render(scene, camera);

  const svg = document.getElementById('container').firstElementChild;
  svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg');
  const blob = new Blob( [svg.outerHTML], { type: "image/svg+xml" } );
  link.href = URL.createObjectURL( blob );
  link.download = "attractor.svg"
  link.click();
}

// Export SVG
function exportMIO() {
  console.log("Export MIO()");
}

// Make events
function makeEvents() {
  events.length = 0;

  if(set.artwork_send) {
  // set.width = 4096; // DEBUG
  // set.height = 4096;

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

  const pos = line.geometry.attributes.position;
  events.push(`{ "event_type": "SET_BRUSH_COLOR", "color": { "r": ${0}, "g": ${0}, "b": ${0} }}`);
  // return;

  let last_x, last_y;
  let last_r, last_g, last_b;
  let r, g, b;
  for (let i = 0; i < pos.count; i++) {
      const vw = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      //console.log(vw);
      const vs = vw.project(camera);
      vs.addScalar(1);
      vs.y = 2 - vs.y;
      vs.multiplyScalar(1000);
      // console.log(vs);

      const col = new THREE.Color();
      col.fromBufferAttribute(line.geometry.attributes.color, i);
      
      r = Math.floor(col.r * 255);
      g = Math.floor(col.g * 255);
      b = Math.floor(col.b * 255);
      if(Number.isNaN(b))
        b = 0;  // DEBUG: check for NaN

      // console.log(r);
      // console.log(g); 
      // console.log(b);
      // console.log('----');

      if (r != last_r || g != last_g || b != last_b)
        events.push(`{ "event_type": "SET_BRUSH_COLOR", "color": { "r": ${r}, "g": ${g}, "b": ${b}}}`);
      last_r = r; last_g = g; last_b = b;

      if(i == 0)
        events.push(`{ "event_type": "POINTER_PRESS", "pos": { "x": ${vs.x}, "y": ${vs.y} }}`);
      events.push(`{ "event_type": "POINTER_MOVE", "pos": { "x": ${vs.x}, "y": ${vs.y} }}`);

      // last_x = vs.x;
      // last_y = vs.y;
      // events.push(`{ "event_type": "POINTER_RELEASE", "pos": { "x": ${last_x}, "y": ${last_y} }}`);
      //console.log(`Point ${i}: ${x}, ${y}, ${z}`);
      //console.log(`Color ${i}: ${r}, ${g}, ${b}`);
  }
  // events.push(`{ "event_type": "POINTER_RELEASE", "pos": { "x": ${last_x}, "y": ${last_y} }}`);
}

// Sleep for websocket
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Paint
export async function paint() {
  makeEvents();
  const socket = new WebSocket('ws://localhost:' + PORT);
  socket.onopen = async (event) => {
    setStatus('Connected to server');
    for(let i=0; i<events.length; i++){
      console.log(events[i]); // DEBUG
      socket.send(events[i]);
      if(events[i].includes("NEW_ARTWORK") || // TODO: Remove after EM's fix
         events[i].includes("SET_PAPER") ||
         (events[i].includes("SET_BRUSH") && !events[i].includes("SET_BRUSH_COLOR")) )
      {
         await sleep(SLEEP_TIME);
      }
    }
    socket.close(1000, "Sending complete");
  };

  socket.onmessage = (event) => {
    setStatus('Message from server: ' + event.data);
  };

  socket.onerror = (event) => {
    console.error(event);
    const message = `WebSocket '${event.target.url}' error`;
    setStatus(message);
  };

  socket.onclose = (event) => {
    if (event.wasClean) {
      setStatus(`Connection closed cleanly, code: ${event.code}, reason: ${event.reason}`);
    } else {
      console.error(event);
      const message = `Connection to '${event.target.url}' died, code=${event.code}`;
      setStatus(message);
      alert(message);
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

//
// Init lights
//
function initLights(power)
{
  let ambientLight = new THREE.AmbientLight( 0xffffff, 0.4 );
  scene.add( ambientLight );

  let d1 = new THREE.DirectionalLight( 0xffffff, power );
  d1.position.set( 0, 0, -3 );
  scene.add( d1 );
  //if(help) scene.add( new THREE.DirectionalLightHelper( d1, 1 ) );

  let d2 = new THREE.DirectionalLight( 0xffffff, power );
  d2.position.set( 1, 1, -2 );
  scene.add( d2 );
  //if(help) scene.add( new THREE.DirectionalLightHelper( d2, 1 ) );

  let d3 = new THREE.DirectionalLight( 0xffffff, power );
  d3.position.set( -2 , -2, 2 );
  scene.add( d3 );
  //if(help) scene.add( new THREE.DirectionalLightHelper( d3, 1 ) );

  let d4 = new THREE.DirectionalLight( 0xffffff, power );
  d4.position.set( -2, 2, -2 );
  scene.add( d4 );
  //if(help) scene.add( new THREE.DirectionalLightHelper( d4, 1 ) );

  // Hilight controller
  const light = new THREE.PointLight( 0xffffff, power, 1, 0);
  light.position.set( 0, 0, 0 );
  scene.add( light );
}

//
// On resize
//
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

//
// Animate
//
function animate() {
  renderer.setAnimationLoop( render );
  // ocontrols.autoRotateSpeed = presets[0].speed;
  // ocontrols.update();

  // // Use SVGRenderer instead of WebGLRenderer
  // renderer.render(scene, camera);
  // requestAnimationFrame(animate);
}

//
// Render
//
function render() {
  ocontrols.autoRotateSpeed = presets[0].speed;
  ocontrols.update();
  renderer.render(scene, camera);
}

//
// Run
//
await init();
animate();
