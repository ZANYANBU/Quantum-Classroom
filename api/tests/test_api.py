"""The /execute and /health endpoints."""


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_stdout_and_result_are_returned(run):
    assert run('print("hi")\nresult = 1 + 1') == {"stdout": "hi\n", "result": 2, "error": None}


def test_result_is_none_when_the_code_sets_none(run):
    assert run("x = 1") == {"stdout": "", "result": None, "error": None}


def test_an_exception_is_reported_with_the_output_so_far(run):
    body = run('print("before")\n1 / 0')
    assert body["error"] == "ZeroDivisionError: division by zero"
    assert body["stdout"] == "before\n"
    assert body["result"] is None


def test_a_syntax_error_is_reported_not_raised(run):
    body = run("def (")
    assert body["error"].startswith("SyntaxError")
    assert body["result"] is None


def test_stderr_is_appended_to_the_output(run):
    body = run('import sys\nprint("careful", file=sys.stderr)\nresult = 1')
    assert body["error"] is None
    assert "[stderr]\ncareful" in body["stdout"]


def test_functions_can_use_the_codes_own_imports_and_variables(run):
    # Regression: globals and locals were separate dicts, so any experiment that
    # defined a function failed with "NameError: name 'QuantumCircuit' is not defined".
    body = run(
        "import math\n"
        "scale = 2\n"
        "def area(r):\n"
        "    return scale * math.pi * r\n"
        "result = round(area(1), 3)\n"
    )
    assert body["error"] is None
    assert body["result"] == 6.283


def test_runs_do_not_share_state(run):
    run("leftover = 42")
    assert run("result = leftover")["error"].startswith("NameError")


def test_file_access_is_not_available(run):
    for call in ('open("/etc/hosts")', 'compile("1", "x", "eval")'):
        assert run(call)["error"].startswith("NameError"), call


def test_a_request_without_code_is_rejected(client):
    assert client.post("/execute", json={}).status_code == 422


def test_imports_are_allowed_so_this_is_not_a_sandbox(run):
    # Qiskit code needs imports, and with imports the code can reach the whole
    # standard library. The README says to run the backend locally for this reason.
    assert run("import os\nresult = os.path.basename('/a/b')") == {
        "stdout": "", "result": "b", "error": None}
