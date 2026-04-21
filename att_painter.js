// TODO
//
// 1. Setup color gradient as set of lines (SVG paths)
// 2. Export via custom SVG renderer
//
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';
import { GUI } from '/node_modules/lil-gui/dist/lil-gui.esm.min.js';

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

//
// Init
//
async function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
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
  renderer.setClearColor( 0x0 );

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
  makeAttractor();

  window.addEventListener( 'resize', onWindowResize );
}

// Attractors
function makeAttractor() {

  // Lorenz
  // https://paulbourke.net/fractals/lorenz/

  // let colors = new Float32Array();
  const points = [];
  const N = 20000;

  let colors = new Float32Array(N * 3);
  const divColors = 0.00002;

  let i=0;
  let  x0,y0,z0,x1,y1,z1;
  let  H = set.H; // H = 0.002;
  let  a = set.A;  // 10.0;
  let  b = set.B;  // 28.0; 21.7;
  let  c = set.C;  // 8.0 / 3.0;

  x0 = 0.1;
  y0 = 0;
  z0 = 0;
  for (i=0; i<N; i++) {
    x1 = x0 + H * a * (y0 - x0);
    y1 = y0 + H * (x0 * (b - z0) - y0);
    z1 = z0 + H * (x0 * y0 - c * z0);
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
  geometry.scale(0.04, 0.04, 0.04);
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
  gui.add( set, 'env', 1, 6, 1 ).name( 'Env' ).onChange(  onSetChanged );
  gui.add( set, 'r', 0, 1, 0.01 ).name( 'Red' ).onChange(  onSetChanged );
  gui.add( set, 'g', 0, 1, 0.01 ).name( 'Green' ).onChange(  onSetChanged );
  gui.add( set, 'b', 0, 1, 0.01 ).name( 'Blue' ).onChange(  onSetChanged );
*/
  gui.add( set, 'A', 1, 20, 0.01).name( 'A' ).onChange(  onSetChanged );
  gui.add( set, 'B', 1, 50, 0.01).name( 'B' ).onChange(  onSetChanged );
  gui.add( set, 'C', 0, 10, 0.01).name('C').onChange(  onSetChanged );
  gui.add( set, 'H', 0, 0.015, 0.0001).name( 'H' ).onChange(  onSetChanged );
/*
  gui.add( set, 'fastChroma').name( 'Fast CA' ).onChange(  onSetChanged );
  gui.add( set, 'antialias').name( 'Antialis SMAA' ).onChange(  onSetChanged );
  gui.add( set, 'gamma').name( 'Gamma correction' ).onChange(  onSetChanged );
*/
  gui.add( set, 'speed', -5, 5, 1 ).name( 'Rotate' );
  gui.add( gui.reset(), 'reset' ).name( 'Reset' ).onChange(()=>{ocontrols.reset()});
  gui.add( { exportSVG }, 'exportSVG' ).name( 'Export SVG' );
  gui.add( { exportMIO }, 'exportMIO' ).name( 'Export MIO' );

  // Set colors
  // gui.controllers[1].$name.style.color = "#ff0000";
  // gui.controllers[2].$name.style.color = "#00ff00";
  // gui.controllers[3].$name.style.color = "#0000ff";
  // gui.controllers[12].$name.style.color = "#ff9127";
}

let set = { env: 3,
  r: 0.0,
  g: 0.0,
  b: 0.0,

  A: 10.0,
  B: 21.7,
  C: 8.0 / 3.0,
  H: 0.002,
  correctMips: true,
  fastChroma: false,
  antialias: true,
  gamma: false,
  anx: false,
  any: false,
  anz: false,
  speed: 0
}

// On controls changed
function  onSetChanged() {
  // console.log(set); // DEBUG
  makeAttractor();
}

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
  // ocontrols.autoRotateSpeed = set.speed;
  // ocontrols.update();

  // // Use SVGRenderer instead of WebGLRenderer
  // renderer.render(scene, camera);
  // requestAnimationFrame(animate);
}

//
// Render
//
function render() {
  ocontrols.autoRotateSpeed = set.speed;
  ocontrols.update();
  renderer.render(scene, camera);
}

//
// Run
//
await init();
animate();
