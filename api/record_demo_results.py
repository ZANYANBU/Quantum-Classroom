"""Record one real run of every experiment, for the static live demo.

The demo on GitHub Pages has no backend, so its Run button replays these
results. Regenerate them after changing an experiment:

    cd api && python record_demo_results.py
"""

import json
import sys
from pathlib import Path

from fastapi.testclient import TestClient

API_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(API_DIR / "tests"))

from conftest import EXPERIMENTS, main  # noqa: E402

OUTPUT = API_DIR.parent / "frontend" / "public" / "demo-results.json"


def record():
    client = TestClient(main.app)
    results = {}
    for experiment in EXPERIMENTS:
        body = client.post("/execute", json={"code": experiment["code"]}).json()
        if body["error"] is not None:
            raise SystemExit(f'{experiment["slug"]} failed: {body["error"]}')
        results[experiment["slug"]] = body
    OUTPUT.write_text(json.dumps(results, indent=1) + "\n", encoding="utf-8")
    print(f"recorded {len(results)} experiments to {OUTPUT.relative_to(API_DIR.parent)}")


if __name__ == "__main__":
    record()
