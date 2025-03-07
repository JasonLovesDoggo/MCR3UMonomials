// Toggle solution visibility
function toggleSolution(button) {
  const solution = button.previousElementSibling
  if (solution.style.display === "block") {
    solution.style.display = "none"
    button.textContent = "Show Solution"
  } else {
    solution.style.display = "block"
    button.textContent = "Hide Solution"
  }
}

// Show hint
function showHint(hintId) {
  const hint = document.getElementById(hintId)
  if (hint.style.display === "block") {
    hint.style.display = "none"
  } else {
    hint.style.display = "block"
  }
}

// Check answer
function checkAnswer(inputId, correctAnswer) {
  const input = document.getElementById(inputId)
  const feedback = document.getElementById(inputId.replace("-answer", "-feedback"))

  // Normalize the input and correct answer for comparison
  const normalizedInput = normalizeExpression(input.value)
  const normalizedCorrect = normalizeExpression(correctAnswer)

  if (normalizedInput === normalizedCorrect) {
    feedback.textContent = "Correct! Great job!"
    feedback.className = "feedback correct"
  } else {
    feedback.textContent = "Not quite right. Try again!"
    feedback.className = "feedback incorrect"
  }
}

// Normalize expression for comparison (remove spaces, convert ^ to proper format)
function normalizeExpression(expr) {
  return expr.toLowerCase().replace(/\s+/g, "").replace(/\*/g, "").replace(/\^/g, "^")
}

// Format polynomial term properly (handle powers of 0 and 1)
function formatTerm(coefficient, variable, power) {
  if (coefficient === 0) return ""

  let result = ""

  // Handle coefficient
  if (coefficient === 1 && power > 0) {
    // For coefficient of 1 with a variable, don't show the 1
    result = ""
  } else if (coefficient === -1 && power > 0) {
    // For coefficient of -1 with a variable, just show the minus
    result = "-"
  } else {
    // Otherwise show the coefficient
    result = coefficient.toString()
  }

  // Add variable with power
  if (power === 0) {
    // No variable for power of 0
    return result
  } else if (power === 1) {
    // For power of 1, just the variable
    return result + variable
  } else {
    // For higher powers, add the exponent
    return result + variable + "^" + power
  }
}

// FOIL method interactive highlighting
document.addEventListener("DOMContentLoaded", () => {
  const highlightF = document.getElementById("highlight-f")
  const highlightO = document.getElementById("highlight-o")
  const highlightI = document.getElementById("highlight-i")
  const highlightL = document.getElementById("highlight-l")
  const showAll = document.getElementById("show-all")

  const firstStep = document.getElementById("first-step")
  const outsideStep = document.getElementById("outside-step")
  const insideStep = document.getElementById("inside-step")
  const lastStep = document.getElementById("last-step")

  function clearHighlights() {
    if (firstStep) firstStep.classList.remove("highlight")
    if (outsideStep) outsideStep.classList.remove("highlight")
    if (insideStep) insideStep.classList.remove("highlight")
    if (lastStep) lastStep.classList.remove("highlight")
  }

  highlightF?.addEventListener("click", () => {
    clearHighlights()
    firstStep.classList.add("highlight")
  })

  highlightO?.addEventListener("click", () => {
    clearHighlights()
    outsideStep.classList.add("highlight")
  })

  highlightI?.addEventListener("click", () => {
    clearHighlights()
    insideStep.classList.add("highlight")
  })

  highlightL?.addEventListener("click", () => {
    clearHighlights()
    lastStep.classList.add("highlight")
  })

  showAll?.addEventListener("click", () => {
    clearHighlights()
  })

  // Problem category selection checkboxes
  const problemCategories = document.querySelectorAll('.problem-category')
  problemCategories.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      // Ensure at least one category is selected
      const atLeastOneChecked = Array.from(problemCategories).some(cb => cb.checked)
      if (!atLeastOneChecked) {
        this.checked = true
      }
    })
  })

  // Update the max power display when slider changes
  const maxPowerSlider = document.getElementById("max-power")
  const maxPowerValue = document.getElementById("max-power-value")

  if (maxPowerSlider && maxPowerValue) {
    maxPowerValue.textContent = maxPowerSlider.value

    maxPowerSlider.addEventListener("input", function() {
      maxPowerValue.textContent = this.value
    })
  }

  // Generate random polynomial multiplication problems
  const generateBtn = document.getElementById("generate-problem")
  const generatedProblemContainer = document.getElementById("generated-problem")

  generateBtn?.addEventListener("click", () => {
    generateAndTypeset()
  })
})

// Check random generated problem answer
function checkRandomAnswer(correctAnswer) {
  const input = document.getElementById("random-problem-answer")
  const feedback = document.getElementById("random-problem-feedback")

  const normalizedInput = normalizeExpression(input.value)
  const normalizedCorrect = normalizeExpression(correctAnswer)

  if (normalizedInput === normalizedCorrect) {
    feedback.textContent = "Correct! Great job!"
    feedback.className = "feedback correct"
  } else {
    feedback.textContent = "Not quite right. Try again!"
    feedback.className = "feedback incorrect"
  }
}

// Get selected problem categories
function getSelectedCategories() {
  const categories = document.querySelectorAll('.problem-category')
  const selectedCategories = []

  categories.forEach(category => {
    if (category.checked) {
      selectedCategories.push(category.value)
    }
  })

  // If no categories are selected, return all categories (should not happen due to UI logic)
  return selectedCategories.length > 0 ? selectedCategories : [
    "binomial-binomial",
    "binomial-square",
    "difference-of-squares",
    "monomial-polynomial",
    "polynomial-polynomial",
    "higher-powers"
  ]
}

// Generate a random integer between min and max (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate random polynomial with specific degree
function generateRandomPolynomial(degree, variable = 'x') {
  const terms = []

  // Generate leading coefficient (non-zero)
  let leadingCoef = randomInt(-5, 5)
  if (leadingCoef === 0) leadingCoef = 1

  // Add the leading term
  terms.push({
    coefficient: leadingCoef,
    power: degree
  })

  // Generate remaining terms
  for (let power = degree - 1; power >= 0; power--) {
    // Make some coefficients zero to create gaps
    const includeThisTerm = randomInt(0, 1)
    if (includeThisTerm || power === 0) { // Always include constant term
      const coef = randomInt(-5, 5)
      if (coef !== 0) {
        terms.push({
          coefficient: coef,
          power: power
        })
      }
    }
  }

  return terms
}

// Format a polynomial with higher powers correctly
function formatHigherPolynomial(terms) {
  if (!terms || terms.length === 0) return "0"

  let result = ""
  let isFirst = true

  // Sort terms by descending power
  terms.sort((a, b) => b.power - a.power)

  for (const term of terms) {
    const { coefficient, power } = term

    if (coefficient === 0) continue

    // Format this term
    let termStr = ""

    // Add coefficient (if not 1 or -1 with variable)
    if (power > 0) {
      if (coefficient === 1) {
        // No coefficient for 1
        termStr = ""
      } else if (coefficient === -1) {
        // Just minus sign for -1
        termStr = "-"
      } else {
        termStr = coefficient.toString()
      }
    } else {
      // Always show coefficient for constant term
      termStr = coefficient.toString()
    }

    // Add variable with power
    if (power > 0) {
      termStr += "x"
      if (power > 1) {
        termStr += "^" + power
      }
    }

    // Add to result with appropriate sign
    if (isFirst) {
      result += termStr
      isFirst = false
    } else {
      if (coefficient > 0) {
        result += "+" + termStr
      } else {
        result += termStr // Negative sign is already included in termStr
      }
    }
  }

  return result || "0"
}

// Generate random polynomial multiplication problem
function generateRandomProblem() {
  const selectedTypes = getSelectedCategories()
  const type = selectedTypes[Math.floor(Math.random() * selectedTypes.length)]

  let question, answer, hint

  switch (type) {
    case "binomial-binomial":
      const a = randomInt(1, 5)
      const b = randomInt(-5, 5)
      const c = randomInt(1, 5)
      const d = randomInt(-5, 5)

      const bSign = b >= 0 ? "+" : ""
      const dSign = d >= 0 ? "+" : ""

      question = `Multiply: \$$(${a}x${bSign}${b})(${c}x${dSign}${d})\$$`

      // Calculate the answer using FOIL
      const first = a * c
      const outside = a * d
      const inside = b * c
      const last = b * d

      // Combine like terms
      const middleTerm = outside + inside

      // Format the answer properly
      let answerParts = []
      if (first !== 0) answerParts.push(formatTerm(first, "x", 2))
      if (middleTerm !== 0) answerParts.push(formatTerm(middleTerm, "x", 1))
      if (last !== 0) answerParts.push(formatTerm(last, "x", 0))

      answer = answerParts.join("+").replace(/\+\-/g, "-")
      hint = `Use the FOIL method:\nF: ${a}x · ${c}x = ${first}x²\nO: ${a}x · ${d} = ${a * d}x\nI: ${b} · ${c}x = ${b * c}x\nL: ${b} · ${d} = ${b * d}`
      break;

    case "binomial-square":
      const p = randomInt(1, 5)
      const q = randomInt(-5, 5)
      const qSign = q >= 0 ? "+" : ""

      question = `Simplify: \$$(${p}x${qSign}${q})^2\$$`

      // Calculate using (a+b)² = a² + 2ab + b²
      const pSquared = p * p
      const middle = 2 * p * q
      const qSquared = q * q

      // Format the answer properly
      let squareAnswerParts = []
      if (pSquared !== 0) squareAnswerParts.push(formatTerm(pSquared, "x", 2))
      if (middle !== 0) squareAnswerParts.push(formatTerm(middle, "x", 1))
      if (qSquared !== 0) squareAnswerParts.push(formatTerm(qSquared, "x", 0))

      answer = squareAnswerParts.join("+").replace(/\+\-/g, "-")
      hint = `Use the formula (a+b)² = a² + 2ab + b²:\n(${p}x${qSign}${q})² = (${p}x)² + 2(${p}x)(${q}) + (${q})²`
      break;

    case "difference-of-squares":
      const r = randomInt(1, 5)
      const s = randomInt(1, 5)

      question = `Simplify: \$$(${r}x+${s})(${r}x-${s})\$$`

      // Calculate using (a+b)(a-b) = a² - b²
      const rSquared = r * r
      const sSquared = s * s

      answer = `${rSquared}x^2-${sSquared}`
      hint = `Use the formula (a+b)(a-b) = a² - b²:\n(${r}x+${s})(${r}x-${s}) = (${r}x)² - (${s})²`
      break;

    case "monomial-polynomial":
      const m = randomInt(1, 5)
      const n1 = randomInt(1, 5)
      const n2 = randomInt(-5, 5)
      const n3 = randomInt(-5, 5)

      // Create polynomial terms
      const polyTerms = [
        { coefficient: n1, power: 2 },
        { coefficient: n2, power: 1 },
        { coefficient: n3, power: 0 }
      ].filter(term => term.coefficient !== 0);

      const polyStr = formatHigherPolynomial(polyTerms);

      question = `Multiply: \$$${m}x(${polyStr})\$$`

      // Calculate result terms
      const resultTerms = polyTerms.map(term => ({
        coefficient: m * term.coefficient,
        power: term.power + 1
      }));

      answer = formatHigherPolynomial(resultTerms);
      hint = `Use the distributive property:\n${m}x(${polyStr}) = ${m}x · each term`;
      break;

    case "polynomial-polynomial":
      const poly1Terms = generateRandomPolynomial(1);
      const poly2Terms = generateRandomPolynomial(2);

      const poly1Str = formatHigherPolynomial(poly1Terms);
      const poly2Str = formatHigherPolynomial(poly2Terms);

      question = `Multiply: \$$(${poly1Str})(${poly2Str})\$$`

      // Calculate result by multiplying each term
      const resultPolyTerms = [];
      for (const term1 of poly1Terms) {
        for (const term2 of poly2Terms) {
          const newCoef = term1.coefficient * term2.coefficient;
          const newPower = term1.power + term2.power;

          // Find if we already have a term with this power
          const existingTerm = resultPolyTerms.find(t => t.power === newPower);
          if (existingTerm) {
            existingTerm.coefficient += newCoef;
          } else {
            resultPolyTerms.push({ coefficient: newCoef, power: newPower });
          }
        }
      }

      answer = formatHigherPolynomial(resultPolyTerms);
      hint = `Multiply each term of the first polynomial by each term of the second, then combine like terms.`;
      break;

    case "higher-powers":
      // Get the maximum power from the slider
      const maxPower = parseInt(document.getElementById("max-power")?.value || "5");

      // Generate degrees between 2 and maxPower
      const highDegree1 = randomInt(2, Math.max(2, maxPower - 2));
      const highDegree2 = randomInt(2, Math.max(2, maxPower - highDegree1));

      // Generate polynomials with higher powers
      const highPoly1Terms = generateRandomPolynomial(highDegree1);
      const highPoly2Terms = generateRandomPolynomial(highDegree2);

      const highPoly1Str = formatHigherPolynomial(highPoly1Terms);
      const highPoly2Str = formatHigherPolynomial(highPoly2Terms);

      question = `Multiply: \$$(${highPoly1Str})(${highPoly2Str})\$$`

      // Calculate result for high-power polynomials
      const resultHighTerms = [];
      for (const term1 of highPoly1Terms) {
        for (const term2 of highPoly2Terms) {
          const newCoef = term1.coefficient * term2.coefficient;
          const newPower = term1.power + term2.power;

          // Find if we already have a term with this power
          const existingTerm = resultHighTerms.find(t => t.power === newPower);
          if (existingTerm) {
            existingTerm.coefficient += newCoef;
          } else {
            resultHighTerms.push({ coefficient: newCoef, power: newPower });
          }
        }
      }

      answer = formatHigherPolynomial(resultHighTerms);
      hint = `Multiply each term of the first polynomial by each term of the second, then combine like terms.
              The highest degree term will be x^${highDegree1 + highDegree2}.`;
      break;
  }

  return { question, answer, hint }
}

// Show the correct answer
function showAnswer(inputId, correctAnswer) {
  const input = document.getElementById(inputId)
  const feedback = document.getElementById(inputId.replace("-answer", "-feedback"))

  // Display the correct answer
  input.value = correctAnswer

  // Show feedback
  feedback.textContent = `The correct answer is: \$$${correctAnswer}$\$`
  feedback.className = "feedback answer-revealed"
  initMathJax()

}

// Initialize MathJax rendering
function initMathJax() {
  if (typeof MathJax !== "undefined") {
    MathJax.typesetPromise().catch((err) => {
      console.log("MathJax typeset failed:", err)
    })
  }
}

// Call MathJax typeset after generating new problems
function generateAndTypeset() {
  const problem = generateRandomProblem()
  const container = document.getElementById("generated-problem")

  container.innerHTML = `
        <h3>New Problem:</h3>
        <p>${problem.question}</p>
        <div class="answer-input">
            <input type="text" id="random-problem-answer" placeholder="Your answer">
            <button onclick="checkRandomAnswer('${problem.answer}')">Check</button>
            <button class="get-answer-btn" onclick="showAnswer('random-problem-answer', '${problem.answer}')">Get Answer</button>
        </div>
        <div id="random-problem-feedback" class="feedback"></div>
        <button class="hint-btn" onclick="showHint('random-problem-hint')">Hint</button>
        <div id="random-problem-hint" class="hint">
            <p>${problem.hint}</p>
        </div>
    `

  // Rerender math in the new content
  initMathJax()
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize MathJax on page load
  initMathJax()

  // Add event listener for generate button
  const generateBtn = document.getElementById("generate-problem")
  if (generateBtn) {
    generateBtn.addEventListener("click", generateAndTypeset)
  }
})