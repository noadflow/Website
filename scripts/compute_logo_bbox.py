"""
Compute the tight bounding box of the SVG paths in tyjt.svg,
correctly handling relative (lowercase) path commands.
"""
import re

src = open("/home/z/my-project/upload/tyjt.svg").read()
paths = re.findall(r'd="([^"]+)"', src)

all_points = []

for d in paths:
    tokens = re.findall(
        r'[MmLlHhVvCcSsQqTtAaZz]|-?\d*\.?\d+(?:[eE][+-]?\d+)?', d
    )
    cmd = None
    cx, cy = 0.0, 0.0
    i = 0
    while i < len(tokens):
        t = tokens[i]
        if t in "MmLlHhVvCcSsQqTtAaZz":
            cmd = t
            i += 1
            continue
        if cmd in "Mm":
            x, y = float(tokens[i]), float(tokens[i + 1])
            if cmd == "M":
                cx, cy = x, y
            else:
                cx, cy = cx + x, cy + y
            all_points.append((cx, cy))
            i += 2
        elif cmd in "Cc":
            pairs = []
            for j in range(3):
                px, py = float(tokens[i + 2 * j]), float(tokens[i + 2 * j + 1])
                if cmd == "C":
                    pairs.append((px, py))
                else:
                    pairs.append((cx + px, cy + py))
            cx, cy = pairs[2]
            all_points.extend(pairs)
            i += 6
        elif cmd in "Ll":
            x, y = float(tokens[i]), float(tokens[i + 1])
            if cmd == "L":
                cx, cy = x, y
            else:
                cx, cy = cx + x, cy + y
            all_points.append((cx, cy))
            i += 2
        elif cmd in "Hh":
            x = float(tokens[i])
            cx = x if cmd == "H" else cx + x
            all_points.append((cx, cy))
            i += 1
        elif cmd in "Vv":
            y = float(tokens[i])
            cy = y if cmd == "V" else cy + y
            all_points.append((cx, cy))
            i += 1
        elif cmd in "Zz":
            i += 1
        elif cmd in "Aa":
            # 7 params: rx,ry,xrot,large,sweep,x,y
            if i + 6 < len(tokens):
                x, y = float(tokens[i + 5]), float(tokens[i + 6])
                if cmd == "A":
                    cx, cy = x, y
                else:
                    cx, cy = cx + x, cy + y
                all_points.append((cx, cy))
                i += 7
            else:
                i += 1
        else:
            i += 1

xs = [p[0] for p in all_points]
ys = [p[1] for p in all_points]
print(f"x: {min(xs):.2f} .. {max(xs):.2f}  (width {max(xs)-min(xs):.2f})")
print(f"y: {min(ys):.2f} .. {max(ys):.2f}  (height {max(ys)-min(ys):.2f})")

# Suggest a square viewBox with small padding
cx = (min(xs) + max(xs)) / 2
cy = (min(ys) + max(ys)) / 2
side = max(max(xs) - min(xs), max(ys) - min(ys))
pad = side * 0.05
side_padded = side + 2 * pad
vx = cx - side_padded / 2
vy = cy - side_padded / 2
print(f"\nSuggested square viewBox:")
print(f'  viewBox="{vx:.2f} {vy:.2f} {side_padded:.2f} {side_padded:.2f}"')
