# Contributing to Quantum Classroom

Thank you for your interest in contributing to Quantum Classroom! This project aims to make quantum computing education accessible to all students.

## 🤝 How to Contribute

### Reporting Issues
- Use GitHub Issues to report bugs or suggest features
- Provide detailed descriptions with steps to reproduce
- Include screenshots if relevant
- Specify your environment (OS, browser, Python version)

### Suggesting New Experiments
We welcome new quantum computing experiments! To propose one:

1. **Open an Issue** with:
   - Experiment title and learning objectives
   - Required quantum concepts/gates
   - Expected difficulty level (Beginner ⭐ / Intermediate ⭐⭐ / Advanced ⭐⭐⭐)
   - Educational value and target audience

2. **Submit experiment structure**:
   - Aim (1-2 sentences)
   - Theory (200-400 words with LaTeX math)
   - Working Qiskit code (tested and validated)
   - Expected results
   - Assessment questions

### Code Contributions

#### Setup Development Environment
```bash
# Fork the repository
git clone https://github.com/YOUR_USERNAME/Quantum-Classroom.git
cd Quantum-Classroom

# Create feature branch
git checkout -b feature/your-feature-name

# Setup backend
cd api
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt

# Setup frontend
cd ../frontend
npm install
```

#### Making Changes

**Frontend (Next.js/TypeScript):**
- Follow TypeScript best practices
- Use existing component patterns
- Maintain responsive design
- Test on multiple screen sizes
- Run `npm run lint` before committing

**Backend (FastAPI/Python):**
- Follow PEP 8 style guidelines
- Add type hints to all functions
- Test Qiskit code thoroughly
- Ensure timeout handling works
- Validate JSON serialization

**Adding New Experiments:**

Edit `frontend/src/lib/experiments.ts`:

```typescript
{
  id: 13,
  slug: "exp-13",
  title: "Your Experiment Title",
  aim: "Clear learning objective",
  summary: "Brief 1-2 sentence description",
  theory: `**Section Title**
  
  Detailed theory with:
  - Mathematical foundations
  - Key concepts
  - Expected results
  
  Use LaTeX for equations: $|ψ⟩ = α|0⟩ + β|1⟩$
  `,
  code: `from qiskit import QuantumCircuit
from qiskit_aer import Aer

# Your working Qiskit code here
# IMPORTANT: Assign final result to 'result' variable
qc = QuantumCircuit(2, 2)
# ... your circuit ...

result = counts  # This gets returned to frontend
`,
  tags: ["category1", "category2"],
  parameters: [
    { name: "shots", label: "Shots", default: 1024, min: 100, max: 8192 },
    { name: "qubits", label: "Qubits", default: 2, min: 1, max: 5 }
  ]
}
```

#### Commit Guidelines

Use descriptive commit messages:
```bash
# Good commits
git commit -m "Add Experiment 13: Shor's Algorithm"
git commit -m "Fix: Correct QFT phase gate angles"
git commit -m "Improve: Update Grover iteration formula"
git commit -m "Docs: Add troubleshooting for Windows users"

# Bad commits (avoid)
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

#### Pull Request Process

1. **Ensure all tests pass**:
   ```bash
   # Backend
   cd api
   pip install -r requirements-dev.txt
   pytest
   
   # Frontend
   cd frontend
   npm run lint
   npm run build
   ```

2. **Update documentation**:
   - Update README.md if adding features
   - Update DESCRIPTION.md if adding experiments
   - Add comments to complex code

3. **Create Pull Request**:
   - Use clear title describing the change
   - Reference related issues (#123)
   - Describe what changed and why
   - Include screenshots for UI changes
   - List any breaking changes

4. **Review process**:
   - Maintainer will review within 1 week
   - Address feedback promptly
   - Be open to suggestions
   - Maintain respectful communication

## 🎨 Design Guidelines

### UI/UX Principles
- **Accessibility First**: Use semantic HTML, ARIA labels, keyboard navigation
- **Dark Theme**: Maintain quantum-themed dark aesthetic (cyan accents on dark purple/black)
- **Responsive**: Test on mobile (320px+), tablet (768px+), desktop (1024px+)
- **Performance**: Lazy load heavy components, optimize images

### Code Style

**TypeScript/React:**
```typescript
// Use functional components with TypeScript
interface Props {
  experimentId: number;
  onComplete: () => void;
}

export function ExperimentCard({ experimentId, onComplete }: Props) {
  // Component logic
}

// Use descriptive variable names
const [isExecuting, setIsExecuting] = useState(false);
const [measurementCounts, setMeasurementCounts] = useState<Record<string, number>>({});
```

**Python:**
```python
def execute_quantum_code(code: str, timeout: int = 30) -> dict[str, Any]:
    """Execute Qiskit code with timeout protection.
    
    Args:
        code: Python code string containing Qiskit circuit
        timeout: Maximum execution time in seconds
        
    Returns:
        Dictionary with stdout, result, and error fields
    """
    # Implementation
```

## 🧪 Testing Checklist

Before submitting:
- [ ] All experiments execute without errors
- [ ] Results match expected outcomes
- [ ] Code is properly formatted (lint/black)
- [ ] Documentation is updated
- [ ] No console errors in browser
- [ ] Works on Chrome, Firefox, Safari
- [ ] Mobile responsive layout works
- [ ] No dead links in documentation

## 📚 Learning Resources

**Qiskit Documentation:**
- [Qiskit Tutorials](https://qiskit.org/learn/)
- [Qiskit API Reference](https://qiskit.org/documentation/)
- [Qiskit Textbook](https://qiskit.org/textbook/)

**Next.js/React:**
- [Next.js Docs](https://nextjs.org/docs)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

**FastAPI:**
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Pydantic Models](https://docs.pydantic.dev/)

## 🎓 Educational Content Guidelines

When contributing experiments or documentation:

1. **Clear Learning Objectives**: State what students will learn
2. **Scaffolded Difficulty**: Build on previous experiments
3. **Mathematical Rigor**: Use proper notation and LaTeX
4. **Practical Examples**: Show real-world applications
5. **Assessment Questions**: Include 3-5 thought questions
6. **Code Comments**: Explain non-obvious quantum operations

## 🐛 Bug Bounty (Educational)

While we don't offer monetary rewards, we recognize top contributors:
- **Hall of Fame**: Listed in README
- **Contributor Badge**: GitHub profile recognition
- **Co-authorship**: For major contributions, co-authorship on academic papers using this platform

## 📜 Code of Conduct

### Our Standards
- **Respectful**: Value diverse perspectives and experiences
- **Collaborative**: Help others learn and grow
- **Educational**: Focus on learning outcomes
- **Professional**: Maintain academic integrity

### Unacceptable Behavior
- Harassment or discriminatory language
- Plagiarism or academic dishonesty
- Spam or off-topic contributions
- Sharing solutions to assessment questions

## 🤔 Questions?

- **General Questions**: Open a GitHub Discussion
- **Bug Reports**: Open a GitHub Issue
- **Feature Requests**: Open a GitHub Issue with [Feature Request] tag
- **Security Issues**: Email directly (see README for contact)

## 🙏 Recognition

Contributors will be acknowledged in:
- README.md Contributors section
- GitHub Insights
- Release notes for significant contributions

Thank you for helping make quantum computing education accessible! 🚀

---

**Last Updated**: February 2026  
**Maintainer**: V Anbuchelban (@ZANYANBU)
