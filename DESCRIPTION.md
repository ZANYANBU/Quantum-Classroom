# Quantum Classroom - Project Description

## 📋 Executive Summary

Quantum Classroom (QuantumLab) is a full-stack web application designed to provide hands-on quantum computing education through interactive experiments. The platform allows students to learn quantum computing concepts by writing and executing real Qiskit code in a browser-based environment.

**Target Audience**: Undergraduate and graduate students studying quantum computing, physics, or computer science.

**Educational Level**: Introductory to intermediate quantum computing.

**Duration**: 6-8 weeks of coursework (12 experiments).

---

## 🎯 Project Objectives

### Primary Objectives
1. **Democratize Quantum Education**: Provide access to quantum computing tools without requiring expensive hardware
2. **Interactive Learning**: Enable students to learn by doing, not just reading
3. **Immediate Feedback**: Validate student understanding through automated result checking
4. **Comprehensive Coverage**: Cover fundamental concepts through advanced algorithms

### Secondary Objectives
1. **Promote Qiskit Adoption**: Familiarize students with industry-standard tools
2. **Modern Web Development**: Demonstrate full-stack application architecture
3. **Scalable Education**: Support unlimited concurrent users
4. **Open Source**: Contribute to educational resources

---

## 🔬 Pedagogical Approach

### Constructivist Learning
- Students build knowledge through hands-on experimentation
- Active learning through code modification and observation
- Immediate feedback reinforces correct understanding

### Scaffolded Instruction
- **Foundation Track**: Basic quantum mechanics and gates
- **Principles Track**: Intermediate quantum phenomena
- **Algorithms Track**: Industry-relevant applications

### Theory-Practice Integration
Each experiment includes:
1. **Aim**: Clear learning objective
2. **Theory**: Mathematical and conceptual foundations
3. **Code**: Working implementation
4. **Expected Results**: Verification criteria
5. **Reflection**: Discussion prompts

---

## 📚 Complete Lab Manual

### Course Structure

**Total Experiments**: 12  
**Estimated Time**: 1.5-2 hours per experiment  
**Prerequisites**: Basic programming (Python), linear algebra, probability theory  
**Recommended Schedule**: 2 experiments per week

---

### Track 1: Quantum Foundations (Weeks 1-2)

#### Experiment 1: Quantum State Vectors
**Duration**: 90 minutes  
**Difficulty**: Beginner ⭐

**Learning Objectives:**
- Define computational basis states |0⟩ and |1⟩
- Explain quantum superposition mathematically
- Calculate measurement probabilities from state amplitudes
- Apply the Hadamard gate to create equal superposition

**Pre-Lab Preparation:**
- Review complex numbers and vector notation
- Read about quantum measurement postulate
- Install Qiskit locally (optional)

**Lab Activities:**
1. Create |0⟩ state and measure (baseline)
2. Create |1⟩ state using X gate
3. Create |+⟩ state using Hadamard
4. Vary shot count and observe statistical convergence
5. Calculate theoretical vs. experimental probabilities

**Assessment Questions:**
1. What is the probability of measuring |0⟩ from |+⟩?
2. Why do we need multiple shots?
3. Modify code to create |−⟩ state (H followed by Z)

**Expected Output:**
```
Counts: {'0': 512, '1': 512}
```

---

#### Experiment 2: Single Qubit Gates
**Duration**: 90 minutes  
**Difficulty**: Beginner ⭐

**Learning Objectives:**
- Apply Pauli gates (X, Y, Z) and observe effects
- Distinguish between bit flips and phase flips
- Use phase gates (S, T) for quantum rotations
- Understand gate matrix representations

**Pre-Lab Preparation:**
- Review Pauli matrices in quantum mechanics
- Understand unitary matrix properties
- Review Euler's formula: e^(iθ) = cos(θ) + i·sin(θ)

**Lab Activities:**
1. Apply X gate and observe bit flip
2. Compare Y gate effect (bit + phase flip)
3. Observe Z gate phase flip (no probability change)
4. Chain H-X-H and compare to Z gate
5. Build custom rotation using S and T gates

**Assessment Questions:**
1. Why does Z gate not change measurement probabilities?
2. Prove that X = H·Z·H using matrices
3. Create a gate that rotates by π/8

**Expected Output:**
```
Statevector after X: [0+0j, 1+0j]
Statevector after Z: [1+0j, 0-0j]
```

---

#### Experiment 3: Multi-Qubit Gates and Entanglement
**Duration**: 120 minutes  
**Difficulty**: Intermediate ⭐⭐

**Learning Objectives:**
- Implement CNOT gate for controlled operations
- Create maximally entangled Bell states
- Use SWAP gate for qubit exchange
- Implement Toffoli (CCX) gate for quantum logic

**Pre-Lab Preparation:**
- Review tensor product notation
- Understand controlled operations concept
- Read about EPR paradox and Bell's inequality

**Lab Activities:**
1. Create product state |00⟩ and measure
2. Apply CNOT to create entanglement
3. Create all 4 Bell states
4. Implement SWAP gate using 3 CNOTs
5. Build Toffoli gate and verify truth table

**Assessment Questions:**
1. Why can't we measure individual qubits in Bell state?
2. How does entanglement violate classical intuition?
3. Implement SWAP using only CNOT gates

**Expected Output:**
```
Bell State |Φ+⟩: {'00': 502, '11': 522}
(Only |00⟩ and |11⟩ observed, never |01⟩ or |10⟩)
```

---

### Track 2: Quantum Principles (Weeks 3-4)

#### Experiment 4: Phase Kickback
**Duration**: 90 minutes  
**Difficulty**: Intermediate ⭐⭐

**Learning Objectives:**
- Understand eigenstate concept in quantum gates
- Observe phase accumulation on control qubit
- Recognize phase kickback in quantum algorithms
- Apply to Deutsch-Jozsa algorithm foundation

**Key Concept:**
When a controlled-U gate acts on an eigenstate |ψ⟩ where U|ψ⟩ = e^(iφ)|ψ⟩, the phase e^(iφ) accumulates on the control qubit, not the target.

**Lab Activities:**
1. Prepare |+⟩ state as Z-gate eigenstate
2. Apply controlled-Z and observe control qubit phase
3. Test with different eigenstates
4. Measure phase using interferometry

**Assessment:**
1. Calculate eigenvalues of Pauli Z gate
2. Explain why |+⟩ is eigenstate of X
3. Derive phase kickback mathematically

---

#### Experiment 5: Circuit Identities
**Duration**: 90 minutes  
**Difficulty**: Beginner ⭐

**Learning Objectives:**
- Verify quantum circuit equivalences experimentally
- Optimize circuits by removing redundant gates
- Apply identities for circuit simplification

**Common Identities:**
- H·Z·H = X
- X·X = I
- H·H = I
- S·S = Z

**Lab Activities:**
1. Verify H·Z·H = X identity
2. Test gate cancellation (X·X = I)
3. Simplify complex circuits
4. Measure circuit depth before/after optimization

**Assessment:**
1. Prove S² = Z using matrix multiplication
2. Find identity for Y gate using H and Z
3. Optimize a 10-gate circuit to 3 gates

---

#### Experiment 6: Quantum Arithmetic - Half Adder
**Duration**: 120 minutes  
**Difficulty**: Intermediate ⭐⭐

**Learning Objectives:**
- Implement reversible classical logic
- Build quantum half adder (sum and carry)
- Understand quantum ALU design principles

**Truth Table:**
| A | B | Sum | Carry |
|---|---|-----|-------|
| 0 | 0 |  0  |   0   |
| 0 | 1 |  1  |   0   |
| 1 | 0 |  1  |   0   |
| 1 | 1 |  0  |   1   |

**Implementation:**
- Sum = A ⊕ B (CNOT gate)
- Carry = A ∧ B (Toffoli gate)

**Lab Activities:**
1. Test all 4 input combinations
2. Verify sum and carry outputs
3. Extend to full adder (with carry-in)
4. Calculate gate count and depth

**Assessment:**
1. Implement quantum full adder
2. Design quantum subtractor
3. Calculate resource requirements for 8-bit adder

---

#### Experiment 7: Circuit Analysis and Metrics
**Duration**: 60 minutes  
**Difficulty**: Beginner ⭐

**Learning Objectives:**
- Measure circuit depth (execution time)
- Count total gates (cost)
- Calculate circuit width (qubit requirement)
- Estimate resource complexity

**Metrics:**
- **Depth**: Longest path of sequential gates
- **Width**: Number of qubits
- **Gate Count**: Total gates used
- **2-Qubit Gates**: More expensive operations

**Lab Activities:**
1. Analyze simple circuit metrics
2. Compare optimized vs. unoptimized circuits
3. Estimate execution time from depth
4. Calculate scalability for N qubits

**Assessment:**
1. Explain why depth matters for NISQ devices
2. Optimize a circuit to minimize depth
3. Estimate decoherence impact based on depth

---

### Track 3: Quantum Algorithms (Weeks 5-6)

#### Experiment 8: Deutsch Algorithm
**Duration**: 120 minutes  
**Difficulty**: Advanced ⭐⭐⭐

**Learning Objectives:**
- Understand quantum parallelism concept
- Classify function properties with one query
- Recognize quantum advantage over classical

**Problem:**
Given a black-box function f:{0,1}→{0,1}, determine if f is:
- **Constant**: f(0)=f(1)
- **Balanced**: f(0)≠f(1)

**Classical Solution**: Requires 2 queries  
**Quantum Solution**: Requires 1 query ✨

**Algorithm Steps:**
1. Initialize |01⟩
2. Apply Hadamard to both qubits → superposition
3. Apply oracle Uf (encodes function f)
4. Apply Hadamard to first qubit
5. Measure: |0⟩=constant, |1⟩=balanced

**Lab Activities:**
1. Implement constant function oracle
2. Implement balanced function oracle
3. Run algorithm and verify classification
4. Measure success probability

**Assessment:**
1. Explain how quantum parallelism works here
2. Draw circuit diagram for balanced function
3. Extend to 2-bit Deutsch-Jozsa algorithm

**Expected Output:**
```
Constant function: {'0': 1024}
Balanced function: {'1': 1024}
```

---

#### Experiment 9: Grover's Search Algorithm
**Duration**: 150 minutes  
**Difficulty**: Advanced ⭐⭐⭐

**Learning Objectives:**
- Implement amplitude amplification
- Design oracle for search problem
- Calculate optimal iteration count
- Achieve O(√N) quantum speedup

**Problem:**
Search unsorted database of N items for marked item.

**Classical Solution**: O(N) average queries  
**Quantum Solution**: O(√N) queries ✨

**Algorithm Components:**
1. **Initialization**: Equal superposition over all states
2. **Oracle**: Flips sign of target state
3. **Diffusion**: Amplifies marked amplitude
4. **Iteration**: Repeat π/4·√N times

**Lab Activities:**
1. Implement oracle for marked state |11⟩
2. Build diffusion operator (inversion about average)
3. Run algorithm with optimal iterations
4. Measure success probability
5. Test with different database sizes (2, 4, 8 items)

**Assessment:**
1. Calculate optimal iterations for N=16
2. Plot success probability vs. iterations
3. Explain geometric interpretation of inversion

**Expected Output:**
```
After 1 iteration (N=4): {'11': 850, others: ~58 each}
Success probability: ~83%
```

---

#### Experiment 10: Quantum Teleportation
**Duration**: 120 minutes  
**Difficulty**: Advanced ⭐⭐⭐

**Learning Objectives:**
- Demonstrate quantum state transfer using entanglement
- Perform Bell state measurements
- Apply conditional corrections based on classical bits
- Understand no-cloning theorem implications

**Protocol:**
Alice wants to send unknown state |ψ⟩ to Bob using:
- Shared Bell pair |Φ+⟩
- 2 classical communication bits

**Steps:**
1. Alice and Bob share Bell pair
2. Alice entangles her qubit with Bell pair
3. Alice measures in Bell basis → 2 classical bits
4. Alice sends classical bits to Bob
5. Bob applies corrections based on bits
6. Bob's qubit now in state |ψ⟩

**Lab Activities:**
1. Create Bell pair between Alice and Bob
2. Prepare arbitrary state |ψ⟩ to teleport
3. Perform Bell measurement
4. Apply Pauli corrections conditionally
5. Verify final state matches original

**Assessment:**
1. Why can't we clone quantum states?
2. Calculate fidelity of teleportation
3. Implement superdense coding (reverse protocol)

**Expected Output:**
```
Original state: |ψ⟩ = 0.6|0⟩ + 0.8|1⟩
Teleported state: |ψ⟩ = 0.6|0⟩ + 0.8|1⟩
Fidelity: 100%
```

---

#### Experiment 11: BB84 Quantum Key Distribution
**Duration**: 120 minutes  
**Difficulty**: Advanced ⭐⭐⭐

**Learning Objectives:**
- Implement quantum cryptography protocol
- Generate secure random keys
- Detect eavesdropping through quantum disturbance
- Understand unconditional security

**Protocol:**
Alice and Bob generate shared secret key over public channel:
1. Alice sends random qubits in random bases (Z or X)
2. Bob measures in random bases
3. They publicly compare basis choices
4. Keep results where bases matched
5. Check subset for errors (eavesdropping detection)

**Security:**
Any eavesdropper (Eve) must measure qubits, causing disturbance detectable by Alice and Bob.

**Lab Activities:**
1. Simulate Alice sending qubits
2. Simulate Bob's measurements
3. Compare bases and generate key
4. Introduce eavesdropper and detect
5. Calculate error rate thresholds

**Assessment:**
1. Why does measurement create disturbance?
2. Calculate key generation rate
3. Compare to classical key exchange protocols

**Expected Output:**
```
Key bits sent: 100
Matching bases: ~50
Final key length: 40 (after error checking)
Eavesdropping detected: 25% error rate
```

---

#### Experiment 12: Quantum Fourier Transform
**Duration**: 120 minutes  
**Difficulty**: Advanced ⭐⭐⭐

**Learning Objectives:**
- Implement quantum Fourier transform (QFT)
- Understand frequency domain representation
- Build foundation for Shor's algorithm
- Compare to classical FFT complexity

**Transform:**
QFT: |j⟩ → (1/√N) Σₖ e^(2πijk/N) |k⟩

**Classical FFT**: O(N log N)  
**Quantum QFT**: O(log² N) ✨

**Applications:**
- Period finding (Shor's algorithm)
- Phase estimation
- Quantum chemistry simulations

**Lab Activities:**
1. Implement 3-qubit QFT circuit
2. Apply to computational basis states
3. Observe phase relationships
4. Implement inverse QFT
5. Verify QFT·QFT† = I

**Assessment:**
1. Draw circuit diagram for 4-qubit QFT
2. Calculate gate count scaling with n qubits
3. Explain connection to Shor's algorithm

**Expected Output:**
```
QFT|000⟩ = equal superposition with phases
QFT|001⟩ = rotated superposition
Depth: O(n²), Gates: O(n²)
```

---

## 🎓 Assessment Rubric

### Code Functionality (40%)
- ✅ Code executes without errors (10%)
- ✅ Produces expected results (15%)
- ✅ Implements required gates/algorithms (15%)

### Understanding (30%)
- ✅ Correctly answers theory questions (15%)
- ✅ Explains results in own words (15%)

### Experimentation (20%)
- ✅ Modifies code to test variations (10%)
- ✅ Analyzes unexpected results (10%)

### Documentation (10%)
- ✅ Comments code appropriately (5%)
- ✅ Records observations (5%)

---

## 🛠️ Technical Implementation

### Code Execution Flow
1. Student writes/modifies Qiskit code in Monaco editor
2. Frontend sends POST request to `/api/execute`
3. Backend executes the code (30s timeout)
4. Qiskit runs quantum simulation
5. Results serialized to JSON
6. Frontend visualizes with Recharts
7. Results cached in Zustand store

### Security Measures
- Import restrictions (no `os`, `sys`, `subprocess`)
- Execution timeout (30 seconds max)
- Input validation with Pydantic
- CORS configuration
- Error sanitization

---

## 📊 Learning Analytics

### Tracked Metrics (Future Enhancement)
- Experiments completed per student
- Average time per experiment
- Code modification patterns
- Common errors and misconceptions
- Success rates by experiment

---

## 🎯 Project Outcomes

**Students who complete this course will:**
1. ✅ Write functional Qiskit code independently
2. ✅ Understand fundamental quantum algorithms
3. ✅ Analyze quantum circuits for complexity
4. ✅ Apply quantum computing to solve problems
5. ✅ Explain quantum advantage over classical computing
6. ✅ Design custom quantum experiments

**Career Relevance:**
- IBM Quantum certification pathways
- Quantum computing research
- Quantum software engineering
- Physics and chemistry simulations

---

## 📖 References and Further Reading

### Primary Resources
1. **Qiskit Textbook**: https://qiskit.org/learn
2. **Nielsen & Chuang**: "Quantum Computation and Quantum Information"
3. **IBM Quantum Learning**: https://quantum-computing.ibm.com/

### Research Papers
1. Deutsch, D. (1985). "Quantum theory, the Church-Turing principle"
2. Grover, L. K. (1996). "A fast quantum mechanical algorithm for database search"
3. Bennett, C. H. et al. (1993). "Teleporting an unknown quantum state"
4. Bennett, C. H. & Brassard, G. (1984). "BB84 protocol"

### Online Courses
1. MIT OpenCourseWare: Quantum Computing
2. Coursera: Quantum Computing by IBM
3. edX: Quantum Mechanics and Quantum Computation

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Author**: V Anbuchelban, SRM Institute of Science and Technology

