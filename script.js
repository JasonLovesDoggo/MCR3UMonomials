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
    firstStep.classList.remove("highlight")
    outsideStep.classList.remove("highlight")
    insideStep.classList.remove("highlight")
    lastStep.classList.remove("highlight")
  }

  highlightF.addEventListener("click", () => {
    clearHighlights()
    firstStep.classList.add("highlight")
  })

  highlightO.addEventListener("click", () => {
    clearHighlights()
    outsideStep.classList.add("highlight")
  })

  highlightI.addEventListener("click", () => {
    clearHighlights()
    insideStep.classList.add("highlight")
  })

  highlightL.addEventListener("click", () => {
    clearHighlights()
    lastStep.classList.add("highlight")
  })

  showAll.addEventListener("click", () => {
    clearHighlights()
  })

  // Generate random polynomial multiplication problems
  const generateBtn = document.getElementById("generate-problem")
  const generatedProblemContainer = document.getElementById("generated-problem")

  generateBtn.addEventListener("click", () => {
    const problem = generateRandomProblem()
    generatedProblemContainer.innerHTML = `
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

    // Re-render math in the new problem
    initKaTeX()
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

// Generate random polynomial multiplication problem
function generateRandomProblem() {
  const types = [
    "binomial-binomial",
    "binomial-square",
    "difference-of-squares",
    "monomial-polynomial",
    "polynomial-polynomial",
  ]
  const type = types[Math.floor(Math.random() * types.length)]

  let question, answer, hint

  switch (type) {
    case "binomial-binomial":
      const a = Math.floor(Math.random() * 5) + 1
      const b = Math.floor(Math.random() * 10) - 5
      const c = Math.floor(Math.random() * 5) + 1
      const d = Math.floor(Math.random() * 10) - 5

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
      const middleSign = middleTerm >= 0 ? "+" : ""

      answer = `${first}x^2${middleSign}${middleTerm}x${last >= 0 ? "+" : ""}${last}`
      hint = `Use the FOIL method:\nF: ${a}x · ${c}x = ${a * c}x²\nO: ${a}x · ${d} = ${a * d}x\nI: ${b} · ${c}x = ${b * c}x\nL: ${b} · ${d} = ${b * d}`
      break

    case "binomial-square":
      const p = Math.floor(Math.random() * 5) + 1
      const q = Math.floor(Math.random() * 10) - 5
      const qSign = q >= 0 ? "+" : ""

      question = `Simplify: \$$(${p}x${qSign}${q})^2\$$`

      // Calculate using (a+b)² = a² + 2ab + b²
      const pSquared = p * p
      const middle = 2 * p * q
      const qSquared = q * q

      const middleSquareSign = middle >= 0 ? "+" : ""

      answer = `${pSquared}x^2${middleSquareSign}${middle}x+${qSquared}`
      hint = `Use the formula (a+b)² = a² + 2ab + b²:\n(${p}x${qSign}${q})² = (${p}x)² + 2(${p}x)(${q}) + (${q})²`
      break

    case "difference-of-squares":
      const r = Math.floor(Math.random() * 5) + 1
      const s = Math.floor(Math.random() * 5) + 1

      question = `Simplify: \$$(${r}x+${s})(${r}x-${s})\$$`

      // Calculate using (a+b)(a-b) = a² - b²
      const rSquared = r * r
      const sSquared = s * s

      answer = `${rSquared}x^2-${sSquared}`
      hint = `Use the formula (a+b)(a-b) = a² - b²:\n(${r}x+${s})(${r}x-${s}) = (${r}x)² - (${s})²`
      break

    case "monomial-polynomial":
      const m = Math.floor(Math.random() * 5) + 1
      const n1 = Math.floor(Math.random() * 5) + 1
      const n2 = Math.floor(Math.random() * 10) - 5
      const n3 = Math.floor(Math.random() * 10) - 5

      const n2Sign = n2 >= 0 ? "+" : ""
      const n3Sign = n3 >= 0 ? "+" : ""

      question = `Multiply: \$$${m}x(${n1}x^2${n2Sign}${n2}x${n3Sign}${n3})\$$`

      // Calculate using distributive property
      const term1 = m * n1
      const term2 = m * n2
      const term3 = m * n3

      const term2Sign = term2 >= 0 ? "+" : ""
      const term3Sign = term3 >= 0 ? "+" : ""

      answer = `${term1}x^3${term2Sign}${term2}x^2${term3Sign}${term3}x`
      hint = `Use the distributive property:\n${m}x(${n1}x^2${n2Sign}${n2}x${n3Sign}${n3}) = ${m}x·${n1}x^2 + ${m}x·${n2}x + ${m}x·${n3}`
      break

    case "polynomial-polynomial":
      const poly1 = [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 10) - 5]
      const poly2 = [
        Math.floor(Math.random() * 5) + 1,
        Math.floor(Math.random() * 10) - 5,
        Math.floor(Math.random() * 10) - 5,
      ]

      const poly1_1Sign = poly1[1] >= 0 ? "+" : ""
      const poly2_1Sign = poly2[1] >= 0 ? "+" : ""
      const poly2_2Sign = poly2[2] >= 0 ? "+" : ""

      question = `Multiply: \$$(${poly1[0]}x${poly1_1Sign}${poly1[1]})(${poly2[0]}x^2${poly2_1Sign}${poly2[1]}x${poly2_2Sign}${poly2[2]})\$$`

      // Calculate by multiplying each term
      const result = [
        poly1[0] * poly2[0], // x^3 term
        poly1[0] * poly2[1] + poly1[1] * poly2[0], // x^2 term
        poly1[0] * poly2[2] + poly1[1] * poly2[1], // x term
        poly1[1] * poly2[2], // constant term
      ]

      const result1Sign = result[1] >= 0 ? "+" : ""
      const result2Sign = result[2] >= 0 ? "+" : ""
      const result3Sign = result[3] >= 0 ? "+" : ""

      answer = `${result[0]}x^3${result1Sign}${result[1]}x^2${result2Sign}${result[2]}x${result3Sign}${result[3]}`
      hint = `Multiply each term of the first polynomial by each term of the second polynomial:\n(${poly1[0]}x)(${poly2[0]}x^2) + (${poly1[0]}x)(${poly2[1]}x) + (${poly1[0]}x)(${poly2[2]}) + (${poly1[1]})(${poly2[0]}x^2) + (${poly1[1]})(${poly2[1]}x) + (${poly1[1]})(${poly2[2]})`
      break
  }

  return { question, answer, hint }
}

// Declare renderMathInElement (assuming it's provided by MathJax or similar)
// If MathJax is included via CDN, this might not be necessary.
// If using a module bundler, import it: import { renderMathInElement } from 'mathjax';
// For this example, we'll assume it's globally available or included via CDN.
const renderMathInElement = (el, options) => {
  if (typeof MathJax !== "undefined") {
    MathJax.typesetPromise([el]).catch((err) => {
      console.log("Typeset failed: " + err.message)
    })
  } else {
    console.warn("MathJax not found. Ensure it is loaded to render math elements.")
  }
}

// Show the correct answer
function showAnswer(inputId, correctAnswer) {
  const input = document.getElementById(inputId)
  const feedback = document.getElementById(inputId.replace("-answer", "-feedback"))

  // Display the correct answer
  input.value = correctAnswer

  // Show feedback
  feedback.textContent = `The correct answer is: ${correctAnswer}`
  feedback.className = "feedback answer-revealed"
}

// Initialize KaTeX rendering
function initKaTeX() {
  if (typeof MathJax !== "undefined") {
    MathJax.typesetPromise([document.body]).catch((err) => console.error("MathJax typeset failed: " + err.message))
  } else {
    console.warn("MathJax not loaded, math will not be rendered.")
  }
}

// Call initKaTeX when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initKaTeX)

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

// Update event listener to use the new function
document.addEventListener("DOMContentLoaded", () => {
  // Initialize MathJax on page load
  initMathJax()

  // Add event listener for generate button
  const generateBtn = document.getElementById("generate-problem")
  if (generateBtn) {
    generateBtn.addEventListener("click", generateAndTypeset)
  }
})

// Rest of your existing JavaScript code...

