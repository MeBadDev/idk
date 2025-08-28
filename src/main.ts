import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `

  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;">
    <h1 style="text-align: center;">idk what im doing but this looks cool</h1>
    <pre id="ascii-animation" style="font-family: monospace; line-height: 1; background: #111; color: #fff; margin: 0; padding: 0.5em;"></pre>
  </div>
`

// Animation logic
const framePad = (n: number) => n.toString().padStart(4, '0');
const frameBase = '/frames/out';
const frameExt = '.jpg.txt';
const frameDelay = 25; // ms per frame


const asciiEl = document.getElementById('ascii-animation')!;
let frames: (string|null)[] = [];

// Dynamically set font size to fit the animation to the screen
function setFontSizeAndFit(frame: string) {
  if (!frame) return;
  const lines = frame.split('\n');
  const maxCols = Math.max(...lines.map(l => l.length));
  const rows = lines.length;
  const containerWidth = window.innerWidth * 0.95; // 95% of viewport
  const fontSize = Math.max(8, Math.floor(containerWidth / maxCols));
  asciiEl.style.fontSize = fontSize + 'px';
  asciiEl.style.width = maxCols + 'ch';
  asciiEl.style.height = rows + 'em';
}

function loadFrame(idx: number): Promise<string> {
  return fetch(`${frameBase}${framePad(idx)}${frameExt}`)
    .then(r => r.ok ? r.text() : '')
    .catch(() => '');
}

async function showAnimation() {
  let idx = 1;
  while (true) {
    const frame = frames[idx - 1] ?? await loadFrame(idx);
    if (!frame) break;
    frames[idx - 1] = frame;
  asciiEl.textContent = frame;
  setFontSizeAndFit(frame);
    await new Promise(res => setTimeout(res, frameDelay));
    idx++;
  }
}


// Re-apply font size on window resize
window.addEventListener('resize', () => {
  // Use the most recently shown frame (last non-null)
  let lastFrame: string | null = null;
  for (let i = frames.length - 1; i >= 0; --i) {
    const f = frames[i];
    if (f) {
      lastFrame = f;
      break;
    }
  }
  if (lastFrame) setFontSizeAndFit(lastFrame);
});

showAnimation();
