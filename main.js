import { GUI } from '/node_modules/lil-gui/dist/lil-gui.esm.min.js';

// GUI
const prtsGems = { env: 3,
  r: 0.0,
  g: 0.0,
  b: 0.0,
  bounces: 4,
  ior: 2.42,
  correctMips: true,
  fresnel: 0.2,
  aberrationStrength: 0.01,
  fastChroma: false,
  antialias: true,
  gamma: false,
  anx: false,
  any: false,
  anz: false,
  speed: 0
};

const gui = new GUI( {width: 300, title:"Settings", closeFolders:true} );
gui.add( prtsGems, 'env', 1, 6, 1 ).name( 'Env' );
gui.add( prtsGems, 'r', 0, 1, 0.01 ).name( 'Red' );
gui.add( prtsGems, 'g', 0, 1, 0.01 ).name( 'Green' );
gui.add( prtsGems, 'b', 0, 1, 0.01 ).name( 'Blue' );
gui.add( prtsGems, 'bounces', 1, 10, 1).name( 'Bounces' );
gui.add( prtsGems, 'ior', 1, 3, 0.01).name( 'IOR' );
gui.add( prtsGems, 'fresnel', 0, 1, 0.01).name( 'Fresnel' );
gui.add( prtsGems, 'aberrationStrength', 0, 0.3, 0.001).name('CA');
gui.add( prtsGems, 'fastChroma').name( 'Fast CA' );
gui.add( prtsGems, 'antialias').name( 'Antialis SMAA' );
gui.add( prtsGems, 'gamma').name( 'Gamma correction' );
gui.add( prtsGems, 'speed', -5, 5, 1 ).name( 'Rotate' );
gui.add( gui.reset(), 'reset' ).name( 'Reset' ).onChange(()=>{ocontrols.reset()});


//----------------------
// Download
const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );

function download() {
  let filename = "mio.json"
  let content = "QQ";
  const blob = new Blob( [ content ], { type: 'text/plain' } );
  link.href = URL.createObjectURL( blob );
  link.download = filename;
  link.click();
}
window.download = download;
