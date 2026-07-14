from pathlib import Path

p = Path(__file__).resolve()

print(p)

for i, parent in enumerate(p.parents):
    print(i, parent)