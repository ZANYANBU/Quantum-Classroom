"""The 12 experiments the frontend ships, run against the real backend.

The code is read from frontend/src/lib/experiments.ts, so a change there that
breaks an experiment fails here. Where a circuit has one right answer, the test
checks the physics, not only that the code ran.
"""

import math

import pytest

from conftest import EXPERIMENTS, with_parameter

SLIDERS = [
    pytest.param(e, p, value, id=f'{e["slug"]}-{p["name"]}={value}')
    for e in EXPERIMENTS for p in e["parameters"] for value in (p["min"], p["max"])
]


def amplitude(value):
    return complex(value["real"], value["imag"])


def test_all_twelve_experiments_are_present():
    assert [e["id"] for e in EXPERIMENTS] == list(range(1, 13))
    assert [e["slug"] for e in EXPERIMENTS] == [f"exp-{n}" for n in range(1, 13)]


@pytest.mark.parametrize("experiment", EXPERIMENTS, ids=lambda e: f'{e["slug"]} {e["title"]}')
def test_experiment_runs_and_returns_a_result(experiment, results):
    body = results[experiment["slug"]]
    assert body["error"] is None, body["error"]
    assert body["result"] is not None
    assert body["stdout"].strip(), "an experiment should print something for the student"


@pytest.mark.parametrize("experiment", EXPERIMENTS, ids=lambda e: e["slug"])
def test_every_slider_has_something_to_change(experiment):
    import re
    for parameter in experiment["parameters"]:
        found = re.findall(rf'{parameter["name"]}\s*=\s*(\d+)', experiment["code"])
        assert found, f'{parameter["name"]} never appears as "{parameter["name"]} = <number>"'
        assert {int(v) for v in found} == {parameter["default"]}, parameter["name"]
        assert parameter["min"] <= parameter["default"] <= parameter["max"]


@pytest.mark.parametrize("experiment, parameter, value", SLIDERS)
def test_experiment_runs_at_each_end_of_every_slider(experiment, parameter, value, run):
    body = run(with_parameter(experiment["code"], parameter["name"], value))
    assert body["error"] is None, body["error"]


def test_exp1_measures_every_shot(results):
    counts = results["exp-1"]["result"]
    assert set(counts) <= {"0", "1"}
    assert sum(counts.values()) == 1024


def test_exp2_x_gate_flips_zero_to_one(results):
    zero, one = (amplitude(a) for a in results["exp-2"]["result"]["X_gate"])
    assert abs(zero) == pytest.approx(0)
    assert abs(one) == pytest.approx(1)


def test_exp3_cnot_makes_a_bell_state(results):
    state = [amplitude(a) for a in results["exp-3"]["result"]["CNOT_Bell_State"]]
    assert [abs(a) for a in state] == pytest.approx([1 / math.sqrt(2), 0, 0, 1 / math.sqrt(2)])


def test_exp5_circuit_identities_all_hold(results):
    identities = results["exp-5"]["result"]
    assert identities and all(value is True for value in identities.values()), identities


def test_exp6_half_adder_adds_correctly(results):
    table = results["exp-6"]["result"]
    assert {key: (row["sum"], row["carry"]) for key, row in table.items()} == {
        "0+0": (0, 0), "0+1": (1, 0), "1+0": (1, 0), "1+1": (0, 1)}
    assert all(row["correct"] for row in table.values())


def test_exp8_deutsch_tells_constant_from_balanced(results):
    oracles = results["exp-8"]["result"]
    assert len(oracles) == 4
    for name, outcome in oracles.items():
        assert outcome["classification"] == outcome["expected"], name
        assert outcome["correct"] is True, name


def test_exp9_grover_finds_the_marked_state(results):
    found = results["exp-9"]["result"]
    assert found["found_state"] == found["marked_binary"] == "101"
    assert found["success"] is True


def test_exp11_bb84_keys_match_without_an_eavesdropper(results):
    exchange = results["exp-11"]["result"]
    assert exchange["alice_key"] == exchange["bob_key"]
    assert exchange["errors"] == 0
    assert exchange["secure"] is True


def test_exp12_qft_of_a_basis_state_is_uniform_in_magnitude(results):
    transformed = [amplitude(a) for a in results["exp-12"]["result"]["qft_statevector"]]
    assert len(transformed) == 8
    assert [abs(a) for a in transformed] == pytest.approx([1 / math.sqrt(8)] * 8)
