//
// TODO
//
// 1. Disable buttons if 'null' in guiInit
//
import { GUI } from '../node_modules/lil-gui/dist/lil-gui.esm.min.js';

const colorTitle = "hsl(205 61% 65%)";

// GUI
export const set = {
  // Artwork
  artwork_send: true,
  size: "A4, 200 DPI",
  width: 2339,
  height: 1654,
  orientation: 'Landscape',
  units: "px", // TODO: remove
  dpi: 200, // TODO: remove

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
};

let guiWidth, guiHeight, guiOrient;

// Init
export let gui;
export function guiInit(paint, saveEvents, saveSVG, saveLS, open) {

  gui = new GUI( {width: 350, title:"Painter", closeFolders:true} );
  gui.domElement.querySelector('.title').style.color = colorTitle;

  // Artwork 
  const artwork = gui.addFolder( 'Artwork' );
  artwork.domElement.querySelector('.title').style.color = colorTitle;
  artwork.add( set, 'artwork_send' ).name( 'Send' );
  artwork.add( set, 'size', ['A4, 200 DPI', 'A4, 300 DPI', 'A3, 200 DPI',
                            'B4, 300 DPI, [4170 x 2940]', 'B3, 200 DPI, [3940 x 2780]', 'Latter, 300 DPI, [3300 x 2550]',
                              'Quarter Sheet 200, 200 DPI, [3000 x 2200]', 'Half Sheet, 200 DPI, [4400, 3000]'] ).name( 'Size' ).onFinishChange(setSize);
  guiWidth  = artwork.add( set, 'width', 1, 32000, 1 ).name( 'Width' );
  guiHeight = artwork.add( set, 'height', 1, 32000, 1 ).name( 'Heght' );
  guiOrient = artwork.add( set, 'orientation', ['Portrait', 'Landscape'] ).name( '' ).onFinishChange(setOrientation);

  // artwork.add( set, 'units', [ 'px' ] ).name( 'Units' );
  // artwork.add( set, 'dpi', [ '72', '96', '100', '150', '200', '250', '300', '400', '600' ] ).name( 'DPI' );

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

  if(saveSVG != null) {
    set.save_svg = saveSVG;
    gui.add( set, 'save_svg' ).name( 'Save SVG' );
  }

  if(saveEvents != null) {
    set.save_events = saveEvents;
    gui.add( set, 'save_events' ).name( 'Save Events' );
  }

  if(saveLS != null) {
    set.save_ls = saveLS;
    gui.add( set, 'save_ls' ).name( 'Save L-System' );
  }

  set.paint = paint;
  gui.add( set, 'paint' ).name( 'Paint' );

  if(open)
    gui.open();
  else
    gui.close();
}

// Set size
function setSize(val) {
  if(val == "A4, 200 DPI") {
    set.width = 2339; set.height = 1654; 
  } if(val == "A4, 300 DPI") {
    set.width = 3508; set.height = 2480;
  } if(val == "A3, 200 DPI") {
    set.width = 3307; set.height = 2339;
  } if(val == "B4, 300 DPI, [4170 x 2940]") {
    set.width = 4170; set.height = 2940;
  } if(val == "B3, 200 DPI, [3940 x 2780]") {
    set.width = 3940; set.height = 2780;
  } if(val == "Latter, 300 DPI, [3300 x 2550]") {
    set.width = 3300; set.height = 2550;
  } if(val == "Quarter Sheet 200, 200 DPI, [3000 x 2200]") {
    set.width = 3000; set.height = 2200;
  } if(val == "Half Sheet, 200 DPI, [4400, 3000]") {
    set.width = 4400; set.height = 3000;
  }
  guiWidth.updateDisplay();
  guiHeight.updateDisplay();

  set.orientation = 'Landscape';
  guiOrient.updateDisplay();
}

// Set orientation
function setOrientation(val) {
  const max = Math.max(set.width, set.height);
  const min = Math.min(set.width, set.height);

  if(val == "Landscape") {
    set.width = max;
    set.height = min;
  } else {
    set.width = min;
    set.height = max;
  }

  guiWidth.updateDisplay();
  guiHeight.updateDisplay();
}

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
