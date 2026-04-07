// TODO
//
// -- Show overlay on load 
// -- Separate paint module
//
// 1. Artworks presets as in Rebelle:
//    Size: A4 200 DPI (2339x1654), A4 300 DPI (3508x2480), A3 200 DPI (3307x2339), ... (Set Width/Height)
//    Orientation: Portrait/Landscape (Swap Width/Height)
//    Remove DPI
//
// 2. Position sketches at the center on load
//
// 3. Remove duplicated events (check)
// 4. Remove unwanted lines (check)
// 5. Use stroke width:
//  {
//     "event_type": "SET_BRUSH_PARAMS",
//     "size": 40,
//     "size_px" : 20, // use either size or size_px
//     "water": 50,
//     "opacity": 80,
//     "pressure": 100,
//     "dirty_brush": true
// }
//
import { guiInit, gui } from './modules/gui.js';
import { saveEvents, paint } from './modules/painter.js';

guiInit(paint, saveEvents, true);
// Customize GUI here
// gui.reset();
//
