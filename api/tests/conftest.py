"""Shared fixtures: an API client, and the experiments the frontend ships."""

import re
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

API_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(API_DIR))

import main  # noqa: E402

EXPERIMENTS_TS = API_DIR.parent / "frontend" / "src" / "lib" / "experiments.ts"


def load_experiments():
    """Read the 12 experiments straight from the frontend source, so the tests
    run the code a student actually gets, not a copy of it."""
    source = EXPERIMENTS_TS.read_text(encoding="utf-8")
    starts = [m.start() for m in re.finditer(r"\bid:\s*\d+,\s*slug:", source)]
    experiments = []
    for begin, end in zip(starts, starts[1:] + [len(source)]):
        block = source[begin:end]
        head = re.match(r'id:\s*(\d+),\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)"', block)
        code = re.search(r"\bcode:\s*`(.*?)`", block, flags=re.S)
        params = re.search(r"\bparameters:\s*\[(.*?)\]", block, flags=re.S)
        experiments.append({
            "id": int(head.group(1)),
            "slug": head.group(2),
            "title": head.group(3),
            "code": code.group(1),
            "parameters": [
                {"name": name, "default": int(default), "min": int(low), "max": int(high)}
                for name, default, low, high in re.findall(
                    r'name:\s*"(\w+)".*?default:\s*(\d+),\s*min:\s*(\d+),\s*max:\s*(\d+)',
                    params.group(1) if params else "")
            ],
        })
    return experiments


EXPERIMENTS = load_experiments()


def with_parameter(code, name, value):
    """Set a slider the way the frontend does (experiment-workspace.tsx)."""
    return re.sub(rf"{name}\s*=\s*\d+", f"{name}={value}", code)


@pytest.fixture(scope="session")
def client():
    return TestClient(main.app)


@pytest.fixture(scope="session")
def run(client):
    def _run(code):
        response = client.post("/execute", json={"code": code})
        assert response.status_code == 200, response.text
        return response.json()
    return _run


@pytest.fixture(scope="session")
def results(run):
    """Every experiment run once with its default settings, keyed by slug."""
    return {e["slug"]: run(e["code"]) for e in EXPERIMENTS}
