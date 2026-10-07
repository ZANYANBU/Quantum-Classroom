"""Turning Qiskit and NumPy values into JSON the result panel can draw."""

import json

import numpy as np

from main import _serialize_complex


def test_plain_values_pass_through():
    for value in (None, True, 3, 0.5, "text"):
        assert _serialize_complex(value) == value


def test_complex_numbers_become_real_and_imag():
    assert _serialize_complex(1 + 2j) == {"real": 1.0, "imag": 2.0}
    assert _serialize_complex(np.complex128(0.5 - 1j)) == {"real": 0.5, "imag": -1.0}


def test_numpy_scalars_become_python_numbers():
    assert _serialize_complex(np.int64(3)) == 3
    assert _serialize_complex(np.float32(0.5)) == 0.5
    assert isinstance(_serialize_complex(np.int64(3)), int)


def test_numpy_booleans_stay_booleans():
    assert _serialize_complex(np.float64(1) == np.float64(1)) is True
    assert _serialize_complex(np.bool_(False)) is False


def test_arrays_become_lists():
    assert _serialize_complex(np.array([[1, 2], [3, 4]])) == [[1, 2], [3, 4]]


def test_complex_arrays_use_the_same_shape_as_complex_numbers():
    assert _serialize_complex(np.array([1 + 2j, 3])) == [
        {"real": 1.0, "imag": 2.0}, {"real": 3.0, "imag": 0.0}]


def test_containers_are_handled_recursively():
    value = {1: (np.int64(2), 1j), "counts": {"00": np.int64(512)}}
    assert _serialize_complex(value) == {
        "1": [2, {"real": 0.0, "imag": 1.0}], "counts": {"00": 512}}


def test_unknown_objects_fall_back_to_their_text():
    class Circuit:
        def __repr__(self):
            return "<circuit>"

    assert _serialize_complex(Circuit()) == "<circuit>"


def test_a_statevector_survives_a_round_trip_through_json(run):
    body = run(
        "from qiskit import QuantumCircuit\n"
        "from qiskit.quantum_info import Statevector\n"
        "qc = QuantumCircuit(1)\n"
        "qc.h(0)\n"
        "result = Statevector(qc).data\n"
    )
    assert body["error"] is None
    amplitudes = json.loads(json.dumps(body["result"]))
    assert [round(a["real"], 6) for a in amplitudes] == [0.707107, 0.707107]
    assert [a["imag"] for a in amplitudes] == [0.0, 0.0]
