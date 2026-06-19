"""
Compute tight bounding box of the SVG paths in tyjt.svg.
"""
import re

src = open("/home/z/my-project/upload/tyjt.svg").read()

path_ds = re.findall(r'd="([^"]+)"', src)

all_x = []
all_y = []

for d in path_ds:
    tokens = re.split(r'([MmLlHhVvCcSsQqTtAaZz])', d)
    cmd = None
    for tok in tokens:
        tok = tok.strip()
        if not tok:
            continue
        if tok in "MmLlHhVvCcSsQqTtAaZz":
            cmd = tok
            continue
        nums = [float(n) for n in re.findall(r'-?\d*\.?\d+(?:[eE][+-]?\d+)?', tok)]
        i = 0
        if cmd in "Hh":
            for n in nums:
                all_x.append(n)
        elif cmd in "Vv":
            for n in nums:
                all_y.append(n)
        elif cmd in "Aa":
            while i + 6 < len(nums):
                all_x.append(nums[i+5])
                all_y.append(nums[i+6])
                i += 7
        else:
            while i + 1 < len(nums):
                all_x.append(nums[i])
                all_y.append(nums[i+1])
                i += 2

print(f"x range: {min(all_x):.2f} .. {max(all_x):.2f}  (width {max(all_x)-min(all_x):.2f})")
print(f"y range: {min(all_y):.2f} .. {max(all_y):.2f}  (height {max(all_y)-min(all_y):.2f})")

cx = (min(all_x) + max(all_x)) / 2
cy = (min(all_y) + max(all_y)) / 2
side = max(max(all_x)-min(all_x), max(all_y)-min(all_y))
pad = side * 0.06
side_padded = side + 2 * pad
vx = cx - side_padded / 2
vy = cy - side_padded / 2
print(f"\nSuggested square viewBox:")
print(f'  viewBox="{vx:.2f} {vy:.2f} {side_padded:.2f} {side_padded:.2f}"')
print(f"  (center {cx:.2f}, {cy:.2f}, side {side_padded:.2f})")
