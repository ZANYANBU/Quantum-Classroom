export type Experiment = {
  id: number;
  slug: string;
  title: string;
  aim: string;
  summary: string;
  theory: string;
  code: string;
  tags: string[];
  parameters?: { name: string; label: string; default: number; min: number; max: number }[];
};

export const experiments: Experiment[] = [
  {
    id: 1,
    slug: "exp-1",
    title: "State Vectors",
    aim: "Observe computational basis states and simple superposition",
    summary:
      "Prepare |0>, |1>, and |+> to see how measurement probabilities change when moving into superposition.",
    theory: `**Quantum State Vectors**

In quantum computing, a qubit's state is represented as a vector in a 2D complex vector space:

|ψ⟩ = α|0⟩ + β|1⟩

where |α|² + |β|² = 1 (normalization condition).

**Key Concepts:**

1. **Computational Basis States**: |0⟩ and |1⟩ are orthonormal basis vectors
2. **Superposition**: A qubit can exist in a linear combination of basis states
3. **Measurement**: Collapses the superposition with probabilities |α|² and |β|²

**The Hadamard Gate**:

H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩

This creates an equal superposition with 50% probability for each outcome.

**Expected Results**: Approximately 512 counts each for '0' and '1' with 1024 shots.`,
    code: `from qiskit import QuantumCircuit
from qiskit_aer import Aer

# Single-qubit circuit that prepares |+> and measures in Z-basis
qc = QuantumCircuit(1, 1)
qc.h(0)
qc.measure(0, 0)

sim = Aer.get_backend("qasm_simulator")
job = sim.run(qc, shots=1024)
counts = job.result().get_counts(qc)

print("Counts:", counts)
result = counts  # "result" will be returned to the UI
`,
    tags: ["statevector", "superposition"],
    parameters: [
      { name: "shots", label: "Number of Shots", default: 1024, min: 100, max: 8192 }
    ],
  },
  {
    id: 2,
    slug: "exp-2",
    title: "Single Qubit Gates",
    aim: "Explore Pauli and phase gates on a single qubit",
    summary: "Apply X, Y, Z, H, S, and T gates to see phase and bit flips.",
    theory: `**Single Qubit Gates**

Quantum gates are unitary operators that transform qubit states.

**Pauli Gates:**

1. **X Gate** (NOT): Flips |0⟩ ↔ |1⟩
   X = [[0, 1], [1, 0]]

2. **Y Gate**: Combined bit and phase flip
   Y = [[0, -i], [i, 0]]

3. **Z Gate**: Phase flip on |1⟩
   Z = [[1, 0], [0, -1]]

**Phase Gates:**

1. **Hadamard (H)**: Creates superposition
   H = 1/√2 [[1, 1], [1, -1]]

2. **S Gate**: π/2 phase rotation
   S = [[1, 0], [0, i]]

3. **T Gate**: π/4 phase rotation
   T = [[1, 0], [0, e^(iπ/4)]]

**Properties**: All single-qubit gates are unitary (U†U = I) and reversible.

**Expected Results**: Complex amplitudes showing phase and amplitude modifications.`,
    code: `from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector
import numpy as np

# Demonstrate single-qubit gates: X, Y, Z, H, S, T
results = {}

# 1. X gate (bit flip): |0> -> |1>
qc_x = QuantumCircuit(1)
qc_x.x(0)
sv_x = Statevector(qc_x)
results['X_gate'] = sv_x.data.tolist()

# 2. H gate (superposition): |0> -> |+>
qc_h = QuantumCircuit(1)
qc_h.h(0)
sv_h = Statevector(qc_h)
results['H_gate'] = sv_h.data.tolist()

# 3. Z gate (phase flip): applies -1 phase to |1>
qc_z = QuantumCircuit(1)
qc_z.h(0)  # First create superposition
qc_z.z(0)  # Then apply Z
sv_z = Statevector(qc_z)
results['Z_gate'] = sv_z.data.tolist()

# 4. S gate (phase): sqrt(Z)
qc_s = QuantumCircuit(1)
qc_s.h(0)
qc_s.s(0)
sv_s = Statevector(qc_s)
results['S_gate'] = sv_s.data.tolist()

# 5. T gate (π/8 phase)
qc_t = QuantumCircuit(1)
qc_t.h(0)
qc_t.t(0)
sv_t = Statevector(qc_t)
results['T_gate'] = sv_t.data.tolist()

print("Single Qubit Gates Demonstration:")
print(f"X|0> = {np.round(results['X_gate'], 3)}")
print(f"H|0> = {np.round(results['H_gate'], 3)}")
print(f"Z(H|0>) = {np.round(results['Z_gate'], 3)}")
print(f"S(H|0>) = {np.round(results['S_gate'], 3)}")
print(f"T(H|0>) = {np.round(results['T_gate'], 3)}")

result = results
`,
    tags: ["x", "y", "z", "phase"],
    parameters: [],
  },
  {
    id: 3,
    slug: "exp-3",
    title: "Multi Qubit Gates",
    aim: "Demonstrate entangling gates like CNOT, SWAP, and Toffoli",
    summary: "Build simple multi-qubit circuits and observe entanglement.",
    theory: `**Multi-Qubit Gates and Entanglement**

**CNOT (Controlled-NOT):**
Flips target qubit if control is |1⟩

CNOT|00⟩ = |00⟩
CNOT|10⟩ = |11⟩

**Bell State Creation:**
H ⊗ I followed by CNOT creates:
|Φ+⟩ = (|00⟩ + |11⟩)/√2

This is a maximally entangled state - measuring one qubit instantly determines the other!

**SWAP Gate:**
Exchanges the states of two qubits:
SWAP|10⟩ = |01⟩

**Toffoli (CCNOT):**
Flips target if both controls are |1⟩. This is universal for classical computation.

**Entanglement**: A quantum correlation where measuring one qubit affects another instantaneously, violating classical intuition.

**Expected Results**: Bell state shows equal superposition of |00⟩ and |11⟩ only.`,
    code: `from qiskit import QuantumCircuit
from qiskit_aer import Aer
from qiskit.quantum_info import Statevector

results = {}

# 1. CNOT Gate - Creates Bell state (entanglement)
qc_cnot = QuantumCircuit(2)
qc_cnot.h(0)  # Superposition on control
qc_cnot.cx(0, 1)  # CNOT
sv_cnot = Statevector(qc_cnot)
results['CNOT_Bell_State'] = sv_cnot.data.tolist()

# 2. SWAP Gate - Exchanges qubit states
qc_swap = QuantumCircuit(2)
qc_swap.x(0)  # Set first qubit to |1>
qc_swap.swap(0, 1)  # Swap positions
sv_swap = Statevector(qc_swap)
results['SWAP_result'] = sv_swap.data.tolist()

# 3. Toffoli (CCX) - Controlled-Controlled-NOT
qc_toffoli = QuantumCircuit(3, 3)
qc_toffoli.x(0)  # Set control 1 to |1>
qc_toffoli.x(1)  # Set control 2 to |1>
qc_toffoli.ccx(0, 1, 2)  # Toffoli gate
qc_toffoli.measure_all()

sim = Aer.get_backend('qasm_simulator')
job = sim.run(qc_toffoli, shots=1024)
counts_toffoli = job.result().get_counts()
results['Toffoli_measurement'] = counts_toffoli

print("Multi-Qubit Gates:")
print(f"Bell State |Φ+> = {sv_cnot.data}")
print(f"SWAP |10> -> |01>: {sv_swap.data}")
print(f"Toffoli counts: {counts_toffoli}")

result = results
`,
    tags: ["cnot", "swap", "toffoli"],
    parameters: [
      { name: "shots", label: "Number of Shots", default: 1024, min: 100, max: 8192 }
    ],
  },
  {
    id: 4,
    slug: "exp-4",
    title: "Phase Kickback",
    aim: "Show how phase information transfers in controlled operations",
    summary: "Demonstrate phase kickback with controlled phase rotations.",
    theory: `**Phase Kickback Phenomenon**

Phase kickback is a quantum effect where phase information from the target qubit transfers to the control qubit during a controlled operation.

**Mechanism:**

When applying a controlled-unitary C-U:

1. If target is in eigenstate |φ⟩ of U with eigenvalue e^(iθ)
2. The phase e^(iθ) "kicks back" to the control qubit
3. Control: |ψ⟩ → e^(iθ)|ψ⟩

**Example with C-Z:**

Control |+⟩, Target |-⟩

Since |-⟩ is an eigenstate of Z with eigenvalue -1:

C-Z|+⟩|-⟩ = (-1)|+⟩|-⟩ = |-⟩|-⟩

The -1 phase kicks back, flipping control from |+⟩ to |-⟩!

**Applications**: Deutsch-Jozsa algorithm, phase estimation, Grover's oracle.

**Expected Results**: Measurement in X-basis shows control qubit flipped due to phase kickback.`,
    code: `from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector
import numpy as np

# Phase kickback: when controlled-U is applied, phase goes to control
# Example: C-Z gate where target is in |-> state

qc = QuantumCircuit(2)

# Prepare control in |+> and target in |->
qc.h(0)  # Control: |+>
qc.x(1)  # Target: |1>
qc.h(1)  # Target: |->

print("Initial state: control|+>, target|->")
sv_initial = Statevector(qc)

# Apply controlled-Z
qc.cz(0, 1)

print("After C-Z gate with target in |-> state")
sv_final = Statevector(qc)

# Measure in X basis to see phase
qc.h(0)

from qiskit_aer import Aer
qc_measure = qc.copy()
qc_measure.measure_all()

sim = Aer.get_backend('qasm_simulator')
job = sim.run(qc_measure, shots=1024)
counts = job.result().get_counts()

result = {
    'initial_statevector': sv_initial.data.tolist(),
    'after_kickback': sv_final.data.tolist(),
    'x_basis_measurement': counts,
    'explanation': 'Phase kicked back to control: |+> -> |->'
}

print(f"Measurement in X-basis shows phase kickback: {counts}")
print("Control qubit acquired a phase, flipping |+> to |->")
`,
    tags: ["phase", "kickback"],
    parameters: [
      { name: "shots", label: "Number of Shots", default: 1024, min: 100, max: 8192 }
    ],
  },
  {
    id: 5,
    slug: "exp-5",
    title: "Circuit Identities",
    aim: "Verify identities like H-Z-H = X",
    summary: "Prove circuit equivalences via simulation and measurement.",
    theory: `**Quantum Circuit Identities**

Circuit identities are equivalences between different gate sequences that produce the same unitary operation.

**Key Identities:**

1. **H-Z-H = X**: Hadamard basis change converts Z to X
   Proof: H rotates basis by 90°, making Z-axis → X-axis

2. **H-X-H = Z**: Symmetric relationship

3. **S·S = Z**: S is square root of Z
   S = [[1, 0], [0, i]], S² = [[1, 0], [0, -1]] = Z

4. **T⁴ = Z**: T is 4th root of Z
   T = [[1, 0], [0, e^(iπ/4)]], T⁴ = Z

5. **X² = I**: Pauli gates are involutory (self-inverse)

**Mathematical Foundation:**

These follow from group theory and the Clifford algebra structure of quantum gates.

**Verification Method**: Compare unitary matrices using np.allclose() for numerical precision.

**Expected Results**: All identities should verify as TRUE.`,
    code: `from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector, Operator
import numpy as np

identities_verified = {}

# Identity 1: H-Z-H = X
qc_hzh = QuantumCircuit(1)
qc_hzh.h(0)
qc_hzh.z(0)
qc_hzh.h(0)
op_hzh = Operator(qc_hzh)

qc_x = QuantumCircuit(1)
qc_x.x(0)
op_x = Operator(qc_x)

identities_verified['H-Z-H = X'] = np.allclose(op_hzh.data, op_x.data)

# Identity 2: H-X-H = Z
qc_hxh = QuantumCircuit(1)
qc_hxh.h(0)
qc_hxh.x(0)
qc_hxh.h(0)
op_hxh = Operator(qc_hxh)

qc_z = QuantumCircuit(1)
qc_z.z(0)
op_z = Operator(qc_z)

identities_verified['H-X-H = Z'] = np.allclose(op_hxh.data, op_z.data)

# Identity 3: S·S = Z
qc_ss = QuantumCircuit(1)
qc_ss.s(0)
qc_ss.s(0)
op_ss = Operator(qc_ss)

identities_verified['S·S = Z'] = np.allclose(op_ss.data, op_z.data)

# Identity 4: T·T·T·T = Z
qc_tttt = QuantumCircuit(1)
for _ in range(4):
    qc_tttt.t(0)
op_tttt = Operator(qc_tttt)

identities_verified['T^4 = Z'] = np.allclose(op_tttt.data, op_z.data)

# Identity 5: X·X = I
qc_xx = QuantumCircuit(1)
qc_xx.x(0)
qc_xx.x(0)
op_xx = Operator(qc_xx)
op_i = Operator(QuantumCircuit(1))

identities_verified['X·X = I'] = np.allclose(op_xx.data, op_i.data)

print("Circuit Identity Verification:")
for identity, verified in identities_verified.items():
    status = "✓ VERIFIED" if verified else "✗ FAILED"
    print(f"{identity}: {status}")

result = identities_verified
`,
    tags: ["identity", "verification"],
    parameters: [],
  },
  {
    id: 6,
    slug: "exp-6",
    title: "Arithmetic",
    aim: "Construct a quantum half adder and half subtractor",
    summary: "Combine gates to implement basic quantum arithmetic blocks.",
    theory: `**Quantum Arithmetic: Half Adder**

A half adder adds two bits and produces a sum and carry bit.

**Classical Logic:**

Sum = A ⊕ B (XOR)
Carry = A ∧ B (AND)

**Quantum Implementation:**

1. **Sum bit**: Use CNOT gates for XOR
   - CNOT(A → Sum)
   - CNOT(B → Sum)
   - Sum = A ⊕ B

2. **Carry bit**: Use Toffoli (CCNOT) for AND
   - CCNOT(A, B → Carry)
   - Carry = A ∧ B

**Truth Table:**

A | B | Sum | Carry
0 | 0 |  0  |  0
0 | 1 |  1  |  0
1 | 0 |  1  |  0
1 | 1 |  0  |  1

**Reversibility**: Quantum gates are reversible, but measurement destroys superposition.

**Applications**: Building blocks for quantum arithmetic circuits, ripple-carry adders.

**Expected Results**: Correct sum and carry bits for all input combinations (00, 01, 10, 11).`,
    code: `from qiskit import QuantumCircuit
from qiskit_aer import Aer

def half_adder(a, b):
    """Quantum Half Adder: Sum and Carry"""
    qc = QuantumCircuit(4, 2)  # 2 inputs, 1 sum, 1 carry, 2 classical
    
    # Input preparation
    if a == 1:
        qc.x(0)
    if b == 1:
        qc.x(1)
    
    # Half Adder Logic
    # Sum = A XOR B (CNOT)
    qc.cx(0, 2)
    qc.cx(1, 2)
    
    # Carry = A AND B (Toffoli)
    qc.ccx(0, 1, 3)
    
    # Measure sum and carry
    qc.measure(2, 0)  # Sum
    qc.measure(3, 1)  # Carry
    
    return qc

# Test all combinations
results = {}
sim = Aer.get_backend('qasm_simulator')

for a in [0, 1]:
    for b in [0, 1]:
        qc = half_adder(a, b)
        job = sim.run(qc, shots=1024)
        counts = job.result().get_counts()
        
        # Extract most common result
        result_bits = max(counts, key=counts.get)
        # Qiskit prints classical bit 0 on the right: "carry sum"
        carry = int(result_bits[0])
        sum_bit = int(result_bits[1])
        
        expected_sum = a ^ b
        expected_carry = a & b
        
        results[f"{a}+{b}"] = {
            'input': [a, b],
            'sum': sum_bit,
            'carry': carry,
            'expected': [expected_sum, expected_carry],
            'correct': (sum_bit == expected_sum and carry == expected_carry)
        }

print("Quantum Half Adder Results:")
print("-" * 40)
for key, val in results.items():
    status = "✓" if val['correct'] else "✗"
    print(f"{key} = {val['carry']}{val['sum']} {status}")

result = results
`,
    tags: ["adder", "subtractor"],
    parameters: [
      { name: "shots", label: "Number of Shots", default: 1024, min: 100, max: 8192 }
    ],
  },
  {
    id: 7,
    slug: "exp-7",
    title: "Circuit Analysis",
    aim: "Measure circuit depth and width for small programs",
    summary: "Use Qiskit transpiler info to study resource usage.",
    theory: `**Quantum Circuit Complexity**

Circuit complexity measures the resources required to execute a quantum algorithm.

**Key Metrics:**

1. **Circuit Depth**: Number of sequential gate layers
   - Determines runtime on quantum hardware
   - Deeper circuits → more decoherence

2. **Circuit Width**: Number of qubits used
   - Limits hardware requirements
   - Wider circuits → more qubits needed

3. **Gate Count**: Total number of gates
   - Affects error accumulation
   - More gates → higher error rate

4. **Transpilation**: Converting abstract circuits to hardware-compatible gates
   - Optimization levels 0-3
   - Level 3: Aggressive optimization

**Gate Decomposition:**

High-level gates decompose into native gates:
- CNOT, RZ, SX for IBM hardware
- H, CNOT for simulator backends

**Expected Results**: Analysis of depth, size, and optimization ratios for various circuits.`,
    code: `from qiskit import QuantumCircuit, transpile
from qiskit.providers.fake_provider import GenericBackendV2

# Create sample circuits with different complexities
circuits_analysis = {}

# Circuit 1: Simple Bell State
qc1 = QuantumCircuit(2)
qc1.h(0)
qc1.cx(0, 1)

# Circuit 2: GHZ State (3 qubits)
qc2 = QuantumCircuit(3)
qc2.h(0)
qc2.cx(0, 1)
qc2.cx(0, 2)

# Circuit 3: Quantum Fourier Transform (3 qubits)
qc3 = QuantumCircuit(3)
qc3.h(0)
qc3.cp(3.14159/2, 1, 0)
qc3.cp(3.14159/4, 2, 0)
qc3.h(1)
qc3.cp(3.14159/2, 2, 1)
qc3.h(2)

# Circuit 4: Complex entanglement
qc4 = QuantumCircuit(4)
for i in range(4):
    qc4.h(i)
for i in range(3):
    qc4.cx(i, i+1)
qc4.barrier()
for i in range(4):
    qc4.rz(0.5, i)

circuits = {
    'Bell_State': qc1,
    'GHZ_State': qc2,
    'QFT_3qubit': qc3,
    'Complex_Entanglement': qc4
}

# Analyze each circuit
backend = GenericBackendV2(num_qubits=5)

for name, qc in circuits.items():
    # Original circuit stats
    original_depth = qc.depth()
    original_width = qc.width()
    original_size = qc.size()
    original_gates = qc.count_ops()
    
    # Transpiled circuit stats
    qc_transpiled = transpile(qc, backend, optimization_level=3)
    transpiled_depth = qc_transpiled.depth()
    transpiled_size = qc_transpiled.size()
    
    circuits_analysis[name] = {
        'qubits': original_width - qc.num_clbits,
        'original_depth': original_depth,
        'original_size': original_size,
        'original_gates': dict(original_gates),
        'transpiled_depth': transpiled_depth,
        'transpiled_size': transpiled_size,
        'optimization_ratio': round(transpiled_size / original_size, 2) if original_size > 0 else 1.0
    }

print("Circuit Analysis Results:")
print("=" * 50)
for name, stats in circuits_analysis.items():
    print(f"\n{name}:")
    print(f"  Qubits: {stats['qubits']}")
    print(f"  Original - Depth: {stats['original_depth']}, Size: {stats['original_size']}")
    print(f"  Transpiled - Depth: {stats['transpiled_depth']}, Size: {stats['transpiled_size']}")
    print(f"  Optimization: {stats['optimization_ratio']}x")

result = circuits_analysis
`,
    tags: ["depth", "width"],
    parameters: [],
  },
  {
    id: 8,
    slug: "exp-8",
    title: "Deutsch Algorithm",
    aim: "Differentiate constant vs balanced functions",
    summary: "Implement Deutsch to classify oracle types with one query.",
    theory: `**Deutsch Algorithm (1985)**

The first quantum algorithm showing exponential speedup! Determines if a function is constant or balanced with ONE query (classical needs 2).

**Problem:** Given f: {0,1} → {0,1}, determine if:
- **Constant**: f(0) = f(1)
- **Balanced**: f(0) ≠ f(1)

**Quantum Solution:**

1. Prepare: |+⟩|-⟩
2. Apply oracle U_f
3. Measure first qubit after H

**Result:**
- Measure |0⟩ ⇒ Constant
- Measure |1⟩ ⇒ Balanced

**Key Insight: Phase Kickback**

Oracle encodes f as phase:
U_f|x⟩|-⟩ = (-1)^f(x)|x⟩|-⟩

For balanced: phases interfere destructively
For constant: no interference

**Significance**: Proved quantum advantage, inspired Deutsch-Jozsa, Grover, Shor algorithms.

**Expected Results**: Correct classification of all oracle types with 100% success rate.`,
    code: `from qiskit import QuantumCircuit
from qiskit_aer import Aer

def deutsch_oracle(oracle_type, qc, q0, q1):
    """Create oracle: constant-0, constant-1, balanced-identity, balanced-negation"""
    if oracle_type == "constant_0":
        # f(x) = 0 for all x
        pass  # No operation
    elif oracle_type == "constant_1":
        # f(x) = 1 for all x
        qc.x(q1)
    elif oracle_type == "balanced_identity":
        # f(x) = x
        qc.cx(q0, q1)
    elif oracle_type == "balanced_negation":
        # f(x) = NOT x
        qc.cx(q0, q1)
        qc.x(q1)

def deutsch_algorithm(oracle_type):
    """Deutsch algorithm to determine if function is constant or balanced"""
    qc = QuantumCircuit(2, 1)
    
    # Initialize
    qc.x(1)  # Set q1 to |1>
    qc.h(0)  # Hadamard on q0
    qc.h(1)  # Hadamard on q1
    
    qc.barrier()
    
    # Apply oracle
    deutsch_oracle(oracle_type, qc, 0, 1)
    
    qc.barrier()
    
    # Final Hadamard on q0
    qc.h(0)
    
    # Measure q0
    qc.measure(0, 0)
    
    return qc

# Test all four oracle types
oracle_types = ["constant_0", "constant_1", "balanced_identity", "balanced_negation"]
results = {}
sim = Aer.get_backend('qasm_simulator')

for oracle in oracle_types:
    qc = deutsch_algorithm(oracle)
    job = sim.run(qc, shots=1024)
    counts = job.result().get_counts()
    
    # Measurement interpretation
    # |0> -> Constant function
    # |1> -> Balanced function
    measurement = '1' if counts.get('1', 0) > counts.get('0', 0) else '0'
    classification = "BALANCED" if measurement == '1' else "CONSTANT"
    
    is_constant = "constant" in oracle
    is_correct = (classification == "CONSTANT") == is_constant
    
    results[oracle] = {
        'measurement': counts,
        'classification': classification,
        'expected': "CONSTANT" if is_constant else "BALANCED",
        'correct': is_correct
    }

print("Deutsch Algorithm Results:")
print("=" * 50)
for oracle, res in results.items():
    status = "✓" if res['correct'] else "✗"
    print(f"{oracle:20} -> {res['classification']:10} {status}")
    print(f"  Expected: {res['expected']}, Counts: {res['measurement']}")

result = results
`,
    tags: ["algorithm", "oracle"],
    parameters: [
      { name: "shots", label: "Number of Shots", default: 1024, min: 100, max: 8192 }
    ],
  },
  {
    id: 9,
    slug: "exp-9",
    title: "Grover's Algorithm",
    aim: "Search marked items in an unstructured database",
    summary: "Build Grover iterations and observe amplitude amplification.",
    theory: `**Grover's Search Algorithm (1996)**

Provides quadratic speedup for unstructured search: O(√N) vs classical O(N).

**Problem:** Search database of N items to find marked item(s).

**Key Components:**

1. **Oracle**: Marks target by phase flip
   O|x⟩ = -|x⟩ if x is target, else |x⟩

2. **Diffusion Operator**: Inversion about average
   D = 2|ψ⟩⟨ψ| - I

3. **Grover Iteration**: G = D · O
   Amplifies marked state amplitude

**Optimal Iterations:**

k = π/4 × √N iterations gives ~100% success

**Geometric Interpretation:**

Each iteration rotates state vector toward target by ~2θ, where sin(θ) = 1/√N

**Applications**: Database search, SAT solving, collision finding, cryptanalysis.

**Expected Results**: Target state emerges with > 90% probability after optimal iterations.`,
    code: `from qiskit import QuantumCircuit
from qiskit_aer import Aer
import math

def grover_oracle(marked_state, n_qubits):
    """Oracle marks the target state by flipping its phase"""
    qc = QuantumCircuit(n_qubits)
    
    # Convert marked state to binary
    marked_bits = format(marked_state, f'0{n_qubits}b')
    
    # Flip qubits that should be 0 in target
    for i, bit in enumerate(reversed(marked_bits)):
        if bit == '0':
            qc.x(i)
    
    # Multi-controlled Z
    qc.h(n_qubits - 1)
    qc.mcx(list(range(n_qubits - 1)), n_qubits - 1)
    qc.h(n_qubits - 1)
    
    # Flip back
    for i, bit in enumerate(reversed(marked_bits)):
        if bit == '0':
            qc.x(i)
    
    return qc

def grover_diffusion(n_qubits):
    """Grover diffusion operator (inversion about average)"""
    qc = QuantumCircuit(n_qubits)
    
    # Apply Hadamard to all qubits
    qc.h(range(n_qubits))
    
    # Apply X to all qubits
    qc.x(range(n_qubits))
    
    # Multi-controlled Z
    qc.h(n_qubits - 1)
    qc.mcx(list(range(n_qubits - 1)), n_qubits - 1)
    qc.h(n_qubits - 1)
    
    # Apply X to all qubits
    qc.x(range(n_qubits))
    
    # Apply Hadamard to all qubits
    qc.h(range(n_qubits))
    
    return qc

# Grover's algorithm to find marked state
n_qubits = 3
marked_state = 5  # Search for |101>
N = 2**n_qubits
optimal_iterations = int(math.pi/4 * math.sqrt(N))

qc = QuantumCircuit(n_qubits, n_qubits)

# Initialize in superposition
qc.h(range(n_qubits))
qc.barrier()

# Apply Grover iterations
for _ in range(optimal_iterations):
    # Oracle
    qc.compose(grover_oracle(marked_state, n_qubits), inplace=True)
    qc.barrier()
    
    # Diffusion
    qc.compose(grover_diffusion(n_qubits), inplace=True)
    qc.barrier()

# Measure all qubits
qc.measure(range(n_qubits), range(n_qubits))

# Execute
sim = Aer.get_backend('qasm_simulator')
job = sim.run(qc, shots=1024)
counts = job.result().get_counts()

# Analysis
most_common = max(counts, key=counts.get)
most_common_int = int(most_common, 2)

result = {
    'marked_state': marked_state,
    'marked_binary': format(marked_state, f'0{n_qubits}b'),
    'iterations': optimal_iterations,
    'measurement_counts': counts,
    'found_state': most_common,
    'found_state_int': most_common_int,
    'success': most_common_int == marked_state,
    'success_probability': round(counts[most_common] / 1024, 3)
}

print(f"Grover's Algorithm: Searching for |{marked_state}> = |{result['marked_binary']}>")
print(f"Iterations: {optimal_iterations}")
print(f"Found: |{most_common}> with probability {result['success_probability']}")
print(f"Success: {'✓' if result['success'] else '✗'}")
`,
    tags: ["grover", "amplification"],
    parameters: [
      { name: "n_qubits", label: "Number of Qubits", default: 3, min: 2, max: 4 },
      { name: "marked_state", label: "Target State", default: 5, min: 0, max: 7 },
      { name: "shots", label: "Number of Shots", default: 1024, min: 100, max: 8192 }
    ],
  },
  {
    id: 10,
    slug: "exp-10",
    title: "Quantum Teleportation",
    aim: "Teleport an arbitrary single-qubit state",
    summary: "Create Bell pairs and move quantum information via classical bits.",
    theory: `**Quantum Teleportation (1993)**

Transfers quantum state using entanglement + classical communication. No FTL communication!

**Protocol:**

1. **Entanglement**: Alice & Bob share Bell pair |Φ+⟩
2. **Encoding**: Alice performs Bell measurement on her qubit + entangled qubit
3. **Classical**: Alice sends 2 classical bits to Bob
4. **Decoding**: Bob applies corrections based on bits received

**Mathematical Steps:**

Initial: |ψ⟩|Φ+⟩ = (α|0⟩ + β|1⟩) ⊗ (|00⟩ + |11⟩)/√2

After Bell measurement: Bob's qubit becomes σ|ψ⟩ (with corrections)

**Corrections:**
- Bit 01 → Apply X
- Bit 10 → Apply Z
- Bit 11 → Apply XZ

**Key Insights:**
1. Original state destroyed (no-cloning theorem)
2. Requires classical channel (no FTL)
3. Demonstrates non-locality of quantum information

**Expected Results**: Bob receives exact copy of Alice's state after corrections.`,
    code: `from qiskit import QuantumCircuit
from qiskit_aer import Aer
from qiskit.quantum_info import Statevector
import numpy as np

# Quantum Teleportation Protocol
# Alice wants to send qubit state |ψ> to Bob

def teleportation_circuit():
    # 3 qubits: q0 (Alice's state), q1 (Alice's entangled), q2 (Bob's entangled)
    # 2 classical bits for measurement results
    qc = QuantumCircuit(3, 3)
    
    # Prepare state to teleport |ψ> = α|0> + β|1>
    # Let's teleport |+> state
    qc.h(0)
    qc.barrier()
    
    # Create Bell pair between Alice (q1) and Bob (q2)
    qc.h(1)
    qc.cx(1, 2)
    qc.barrier()
    
    # Alice's operations
    qc.cx(0, 1)  # CNOT
    qc.h(0)      # Hadamard
    qc.barrier()
    
    # Alice measures her qubits
    qc.measure(0, 0)
    qc.measure(1, 1)
    qc.barrier()
    
    # Bob's corrections based on Alice's measurements
    qc.x(2).c_if(1, 1)  # If q1=1, apply X
    qc.z(2).c_if(0, 1)  # If q0=1, apply Z
    qc.barrier()
    
    # Measure Bob's qubit to verify teleportation
    qc.measure(2, 2)
    
    return qc

qc = teleportation_circuit()

# Execute
sim = Aer.get_backend('qasm_simulator')
job = sim.run(qc, shots=1024)
counts = job.result().get_counts()

# Analysis
# Original state was |+>, so Bob should measure in superposition
# When measured in Z-basis, Bob should get 50-50 distribution in last bit

bob_measurements = {}
for bitstring, count in counts.items():
    bob_bit = bitstring[0]  # Rightmost bit is Bob's qubit
    bob_measurements[bob_bit] = bob_measurements.get(bob_bit, 0) + count

total_shots = sum(bob_measurements.values())
prob_0 = bob_measurements.get('0', 0) / total_shots
prob_1 = bob_measurements.get('1', 0) / total_shots

# For |+> state, we expect ~50-50 distribution
expected_prob = 0.5
success = abs(prob_0 - expected_prob) < 0.1 and abs(prob_1 - expected_prob) < 0.1

result = {
    'original_state': '|+> = (|0> + |1>)/√2',
    'all_measurements': counts,
    'bob_outcomes': bob_measurements,
    'bob_prob_0': round(prob_0, 3),
    'bob_prob_1': round(prob_1, 3),
    'expected_distribution': '50-50',
    'teleportation_success': success,
    'fidelity': round(1 - 2*abs(prob_0 - 0.5), 3)
}

print("Quantum Teleportation:")
print(f"Original state: {result['original_state']}")
print(f"Bob's measurements: P(0)={result['bob_prob_0']}, P(1)={result['bob_prob_1']}")
print(f"Fidelity: {result['fidelity']}")
print(f"Success: {'✓' if success else '✗'}")
`,
    tags: ["bell", "teleportation"],
    parameters: [
      { name: "shots", label: "Number of Shots", default: 1024, min: 100, max: 8192 }
    ],
  },
  {
    id: 11,
    slug: "exp-11",
    title: "BB84 Protocol",
    aim: "Simulate quantum key distribution steps",
    summary: "Model basis choices, sifting, and eavesdropping checks.",
    theory: `**BB84 Quantum Key Distribution (1984)**

First QKD protocol enabling provably secure communication. Security based on quantum mechanics!

**Protocol Steps:**

1. **Transmission**: Alice sends qubits in random Z/X bases
2. **Measurement**: Bob measures in random Z/X bases
3. **Sifting**: Alice & Bob publicly compare bases, keep matching
4. **Error Check**: Sample subset to detect eavesdropping
5. **Privacy Amplification**: Compress key to remove Eve's info

**Bases:**
- Z-basis: {|0⟩, |1⟩}
- X-basis: {|+⟩, |-⟩}

**Security Principle:**

Eavesdropper (Eve) must measure qubits → disturbs state → introduces errors

Quantum Bit Error Rate (QBER) reveals eavesdropping:
- QBER < 11% → Secure (using error correction)
- QBER > 11% → Abort protocol

**No-Cloning Theorem**: Eve cannot copy quantum states perfectly

**Expected Results**: ~50% matching bases, low QBER, secure shared key.`,
    code: `from qiskit import QuantumCircuit
from qiskit_aer import Aer
import random
import numpy as np

# BB84 Quantum Key Distribution Protocol
n_bits = 16  # Number of qubits to send

# Alice's random bits and bases
alice_bits = [random.randint(0, 1) for _ in range(n_bits)]
alice_bases = [random.randint(0, 1) for _ in range(n_bits)]  # 0=Z, 1=X

# Bob's random bases
bob_bases = [random.randint(0, 1) for _ in range(n_bits)]

# Simulate transmission
bob_measurements = []

for i in range(n_bits):
    qc = QuantumCircuit(1, 1)
    
    # Alice prepares qubit
    if alice_bits[i] == 1:
        qc.x(0)
    
    if alice_bases[i] == 1:  # X basis
        qc.h(0)
    
    # Bob measures
    if bob_bases[i] == 1:  # X basis
        qc.h(0)
    
    qc.measure(0, 0)
    
    # Execute
    sim = Aer.get_backend('qasm_simulator')
    job = sim.run(qc, shots=1)
    result = job.result().get_counts()
    bob_measurements.append(int(list(result.keys())[0]))

# Basis reconciliation (sifting)
matching_bases = [i for i in range(n_bits) if alice_bases[i] == bob_bases[i]]
sifted_key_alice = [alice_bits[i] for i in matching_bases]
sifted_key_bob = [bob_measurements[i] for i in matching_bases]

# Check for errors (eavesdropping detection)
errors = sum([1 for i in range(len(sifted_key_alice)) if sifted_key_alice[i] != sifted_key_bob[i]])
error_rate = errors / len(sifted_key_alice) if len(sifted_key_alice) > 0 else 0

# Security threshold: QBER < 11% is considered secure
secure = error_rate < 0.11

# Final key (without error correction for simplicity)
if secure:
    final_key = sifted_key_alice[:len(sifted_key_alice)//2]  # Use first half
else:
    final_key = []

result = {
    'protocol': 'BB84',
    'transmitted_qubits': n_bits,
    'matching_bases': len(matching_bases),
    'sifted_key_length': len(sifted_key_alice),
    'alice_key': ''.join(map(str, sifted_key_alice)),
    'bob_key': ''.join(map(str, sifted_key_bob)),
    'errors': errors,
    'error_rate': round(error_rate, 4),
    'secure': secure,
    'final_key_length': len(final_key),
    'final_key': ''.join(map(str, final_key)) if final_key else 'INSECURE',
    'security_threshold': '< 11% QBER'
}

print("BB84 Quantum Key Distribution:")
print(f"Transmitted: {n_bits} qubits")
print(f"Matching bases: {result['matching_bases']} ({result['matching_bases']/n_bits*100:.1f}%)")
print(f"Sifted key length: {result['sifted_key_length']}")
print(f"Error rate (QBER): {result['error_rate']*100:.2f}%")
print(f"Security: {'✓ SECURE' if secure else '✗ INSECURE (possible eavesdropping)'}")
print(f"Final shared key length: {result['final_key_length']} bits")
`,
    tags: ["qkd", "bb84"],
    parameters: [
      { name: "n_bits", label: "Qubits Transmitted", default: 16, min: 8, max: 32 }
    ],
  },
  {
    id: 12,
    slug: "exp-12",
    title: "Quantum Fourier Transform",
    aim: "Implement QFT on small registers",
    summary: "Construct and visualize the QFT and inverse QFT.",
    theory: `**Quantum Fourier Transform**

Quantum analogue of discrete Fourier transform, cornerstone of many quantum algorithms.

**Classical DFT:**

y_k = (1/√N) ∑ x_j e^(2πijk/N)

Complexity: O(N log N) with FFT

**Quantum QFT:**

|j⟩ → (1/√N) ∑ e^(2πijk/N)|k⟩

Complexity: O(log²N) gates! Exponential speedup in gate count.

**Circuit Construction:**

1. Apply Hadamard to each qubit
2. Apply controlled phase rotations: CP(π/2^k)
3. Swap qubits to reverse order

**Phase Rotations:**

R_k = [[1, 0], [0, e^(2πi/2^k)]]

**Applications:**

- **Shor's Algorithm**: Period finding for factoring
- **Phase Estimation**: Eigenvalue estimation
- **Quantum simulation**: Hamiltonian evolution

**Inverse QFT**: Simply reverse the circuit

**Expected Results**: QFT → iQFT reconstructs original state perfectly.`,
    code: `from qiskit import QuantumCircuit
from qiskit_aer import Aer
from qiskit.quantum_info import Statevector
import numpy as np
import math

def qft(n_qubits):
    """Creates QFT circuit for n qubits"""
    qc = QuantumCircuit(n_qubits)
    
    for j in range(n_qubits):
        # Apply Hadamard
        qc.h(j)
        
        # Apply controlled phase rotations
        for k in range(j + 1, n_qubits):
            angle = math.pi / (2 ** (k - j))
            qc.cp(angle, k, j)
    
    # Swap qubits to reverse order
    for i in range(n_qubits // 2):
        qc.swap(i, n_qubits - i - 1)
    
    return qc

def inverse_qft(n_qubits):
    """Creates inverse QFT circuit"""
    qc = qft(n_qubits)
    return qc.inverse()

# Apply QFT to |3> state (|011> for 3 qubits)
n_qubits = 3
qc = QuantumCircuit(n_qubits, n_qubits)

# Prepare initial state |3> = |011>
qc.x(0)
qc.x(1)
qc.barrier()

# Get initial statevector
sv_initial = Statevector(qc)

# Apply QFT
qc.compose(qft(n_qubits), inplace=True)
qc.barrier()

# Get QFT statevector
sv_qft = Statevector(qc)

# Apply inverse QFT (should return to |011>)
qc.compose(inverse_qft(n_qubits), inplace=True)
qc.barrier()

# Measure
qc.measure(range(n_qubits), range(n_qubits))

# Execute
sim = Aer.get_backend('qasm_simulator')
job = sim.run(qc, shots=1024)
counts = job.result().get_counts()

# Verify we get back original state
most_common = max(counts, key=counts.get)
original_state = '011'
reconstructed = most_common == original_state

result = {
    'n_qubits': n_qubits,
    'initial_state': original_state,
    'initial_statevector': sv_initial.data.tolist(),
    'qft_statevector': sv_qft.data.tolist(),
    'inverse_qft_measurement': counts,
    'most_probable_state': most_common,
    'reconstruction_success': reconstructed,
    'probability': round(counts[most_common] / 1024, 3),
    'circuit_depth': qc.depth(),
    'gate_count': qc.size()
}

print("Quantum Fourier Transform (QFT):")
print(f"Initial state: |{original_state}> = |3>")
print(f"After QFT → iQFT: |{most_common}>")
print(f"Reconstruction: {'✓' if reconstructed else '✗'}")
print(f"Probability: {result['probability']}")
print(f"Circuit depth: {result['circuit_depth']}, Gates: {result['gate_count']}")
print(f"\nQFT transforms computational basis to Fourier basis,")
print(f"enabling phase estimation and period finding algorithms.")
`,
    tags: ["qft", "fourier"],
    parameters: [
      { name: "n_qubits", label: "Number of Qubits", default: 3, min: 2, max: 5 },
      { name: "shots", label: "Number of Shots", default: 1024, min: 100, max: 8192 }
    ],
  },
];

export const experimentMap = experiments.reduce<Record<string, Experiment>>(
  (acc, exp) => {
    acc[exp.slug] = exp;
    return acc;
  },
  {}
);
