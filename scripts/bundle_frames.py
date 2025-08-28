import os
import json

frames_dir = os.path.join(os.path.dirname(__file__), '../public/frames')
frame_files = sorted(f for f in os.listdir(frames_dir) if f.endswith('.jpg.txt'))
frames = []

for fname in frame_files:
    with open(os.path.join(frames_dir, fname), 'r', encoding='utf-8') as f:
        frames.append(f.read())

with open(os.path.join(frames_dir, 'frames.json'), 'w', encoding='utf-8') as out:
    json.dump(frames, out, ensure_ascii=False)

print(f"Bundled {len(frames)} frames into frames.json")
