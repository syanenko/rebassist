import { guiInit, gui } from './modules/gui.js';
import { saveEvents, paint } from './modules/painter.js';

guiInit(paint, saveEvents, null, null, true);
