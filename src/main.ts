import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `

  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;">
    <h1 style="text-align: center;">idk what im doing but this looks cool</h1>
    <pre id="ascii-animation" style="font-family: monospace; line-height: 1; background: #111; color: #fff; margin: 0; padding: 0.5em;"></pre>
  </div>
`

// Animation logic
const frameDelay = 1000 / 60; // ~16.67 ms per frame for 60fps

const asciiEl = document.getElementById('ascii-animation')!;
let frames: string[] = [];

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


async function loadFramesJson(): Promise<string[]> {
  const res = await fetch('/frames/frames.json');
  if (!res.ok) throw new Error('Could not load frames.json');
  return await res.json();
}


async function showAnimation() {
  if (!frames.length) {
    frames = await loadFramesJson();
  }
  let idx = 0;
  while (true) {
    const frame = frames[idx % frames.length];
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
