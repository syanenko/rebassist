// TODO
//
// 0. Upload with picker
// 1. Icons
// 2. JSON validation (alert)
// 3. Validate JSON before save (?)
// 
const PORT = "8265";
const SLEEP_TIME = 2000;
let events = [];

// Save
const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link );

function save() {
  const blob = new Blob( [ editor.getValue() ], { type: 'text/plain' } );
  link.href = URL.createObjectURL( blob );
  link.download = "events.json"
  link.click();
}
window.save = save;

// Set status
let stat = document.getElementById("status");
function setStatus(s) {
    stat.innerHTML = s;
    console.log(s);
}
window.setStatus = setStatus;

// Sleep for websocket
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Paint
function paint() {
  events.length = 0;
  events = JSON.parse(editor.getValue());

  const socket = new WebSocket('ws://localhost:' + PORT);
  socket.onopen = async (event) => {
    setStatus('Connected to server') 
    let e;
    for(let i=0; i<events.length; i++) {
      e = JSON.stringify(events[i]);
      // console.log(e); // DEBUG
      socket.send(e);
      if(e.includes("NEW_ARTWORK") || // TODO: Remove after EM's fix
         e.includes("SET_PAPER") ||
         e.includes("SET_BRUSH") ||
         e.includes("SET_BRUSH_COLOR")) {
         await sleep(SLEEP_TIME);
      }
    }
    socket.close(1000, "Sending complete");
  };

  socket.onmessage = (event) => {
    setStatus(`Message from server: ${event.data}`);
  };

  socket.onerror = (error) => {
    setStatus(`WebSocket Error: ${error}`);
  };

  socket.onclose = (event) => {
    if (event.wasClean) {
      setStatus(`Connection closed cleanly, code: ${event.code}, reason: ${event.reason}`);
    } else {
      setStatus(`Connection died, code=${event.code}`);
    }
  };
}
window.paint = paint;