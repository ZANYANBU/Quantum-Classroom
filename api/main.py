from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import contextlib
import io
import json
import signal
from typing import Any
import numpy as np


app = FastAPI(title="QuantumLab API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExecuteRequest(BaseModel):
    code: str


class ExecuteResponse(BaseModel):
    stdout: str
    result: Any | None
    error: str | None


@app.get("/health")
async def health():
    return {"status": "ok", "message": "QuantumLab API is running with Qiskit support"}


class TimeoutException(Exception):
    pass


def timeout_handler(signum, frame):
    raise TimeoutException("Execution timeout: code took longer than 30 seconds")


def _serialize_complex(obj: Any) -> Any:
    """Enhanced serialization for complex quantum objects"""
    
    # Handle None
    if obj is None:
        return None
    
    # Handle numpy types
    if isinstance(obj, (np.integer, np.floating)):
        return obj.item()
    
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    
    if isinstance(obj, complex):
        # Represent complex as [real, imag] for JSON
        return {"real": obj.real, "imag": obj.imag}
    
    # Handle dictionaries recursively
    if isinstance(obj, dict):
        return {str(k): _serialize_complex(v) for k, v in obj.items()}
    
    # Handle lists/tuples recursively
    if isinstance(obj, (list, tuple)):
        return [_serialize_complex(item) for item in obj]
    
    # Handle booleans
    if isinstance(obj, bool):
        return obj
    
    # Handle standard numeric types
    if isinstance(obj, (int, float, str)):
        return obj
    
    # Try JSON serialization
    try:
        json.dumps(obj)
        return obj
    except (TypeError, ValueError):
        # Fallback: convert to string representation
        return str(obj)


@app.post("/execute", response_model=ExecuteResponse)
async def execute(payload: ExecuteRequest):
    stdout_buffer = io.StringIO()
    stderr_buffer = io.StringIO()
    local_env: dict[str, Any] = {}
    
    # Set up execution environment with necessary built-ins
    # We need to allow imports but restrict dangerous file operations
    safe_globals = {
        "__builtins__": {
            k: v for k, v in __builtins__.items()
            if k not in ['open', 'compile', 'execfile']  # Keep __import__ for module imports
        }
    }
    
    try:
        # Set timeout (Unix-like systems only; Windows requires different approach)
        # For Windows, we'll skip the timeout for now
        try:
            signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(30)  # 30 second timeout
        except (AttributeError, ValueError):
            # Windows doesn't support SIGALRM, continue without timeout
            pass
        
        # Capture both stdout and stderr
        with contextlib.redirect_stdout(stdout_buffer), contextlib.redirect_stderr(stderr_buffer):
            exec(payload.code, safe_globals, local_env)
        
        # Cancel timeout
        try:
            signal.alarm(0)
        except (AttributeError, ValueError):
            pass
        
        # Serialize the result
        raw_result = local_env.get("result")
        serialized_result = _serialize_complex(raw_result)
        
        # Combine stdout and stderr
        output = stdout_buffer.getvalue()
        errors = stderr_buffer.getvalue()
        if errors:
            output += f"\n[stderr]\n{errors}"
        
        return ExecuteResponse(
            stdout=output,
            result=serialized_result,
            error=None
        )
        
    except TimeoutException as exc:
        try:
            signal.alarm(0)
        except (AttributeError, ValueError):
            pass
        return ExecuteResponse(
            stdout=stdout_buffer.getvalue(),
            result=None,
            error=str(exc)
        )
        
    except Exception as exc:
        try:
            signal.alarm(0)
        except (AttributeError, ValueError):
            pass
        
        error_msg = f"{type(exc).__name__}: {str(exc)}"
        stderr_content = stderr_buffer.getvalue()
        if stderr_content:
            error_msg += f"\n{stderr_content}"
        
        return ExecuteResponse(
            stdout=stdout_buffer.getvalue(),
            result=None,
            error=error_msg
        )
