const isDigit = (char) => /\d/.test(char);
const isOperator = (char) => /[\+\-\*\/\&e]/.test(char);
const isParen = (char) => /[\(\)]/.test(char);
const isWhitespace = (char) => /\s/.test(char);
const isAlpha = (char) => /[a-z]/.test(char);
const mathFunctions = [
  "log",
  "ln",
  "exp",
  "sqrt",
  "abs",
  "atan",
  "acos",
  "asin",
  "sinh",
  "cosh",
  "tanh",
  "tan",
  "sin",
  "cos",
];

function tokenize(input) {
  const tokens = [];

  let position = 0;
  let currentChar = input[position];

  while (currentChar !== undefined) {
    if (isWhitespace(currentChar)) {
      currentChar = input[++position];
      continue;
    }

    if (isDigit(currentChar)) {
      let num = "";

      // Read to the left of a possible decimal point
      while (isDigit(currentChar)) {
        num += currentChar;
        currentChar = input[++position];
      }

      // Read the decimal point and the right side of the number
      if (currentChar === ".") {
        num += currentChar;
        currentChar = input[++position];

        while (isDigit(currentChar)) {
          num += currentChar;
          currentChar = input[++position];
        }
      }

      tokens.push({ type: "NUMBER", value: num });
      continue;
    }

    if (isOperator(currentChar)) {
      let operatorCount = 0;

      if (currentChar === "-") {
        while (currentChar === "-") {
          operatorCount++;
          currentChar = input[++position];
        }

        if (operatorCount % 2 === 0) {
          tokens.push({ type: "OPERATOR", value: "+" });
        } else {
          tokens.push({ type: "OPERATOR", value: "-" });
        }
      } else {
        tokens.push({ type: "OPERATOR", value: currentChar });
        currentChar = input[++position];
      }

      continue;
    }

    if (isParen(currentChar)) {
      tokens.push({ type: "PAREN", value: currentChar });
      currentChar = input[++position];
      continue;
    }

    if (isAlpha(currentChar)) {
      let func = "";

      while (currentChar && isAlpha(currentChar)) {
        func += currentChar;
        currentChar = input[++position];
      }

      if (!mathFunctions.includes(func.toLowerCase())) {
        throw new Error(`Invalid function: ${func} at position ${position}`);
      }

      tokens.push({ type: "FUNCTION", value: func.toLowerCase() });
      continue;
    }

    throw new Error(
      `Invalid character: ${currentChar} at position ${position}`
    );
  }

  return tokens;
}

function parse(tokens) {
  let position = 0;
  let currentToken = tokens[position];

  function parseExpression() {
    let leftExpression = parseTerm();

    while (
      currentToken !== undefined &&
      (currentToken.value === "+" || currentToken.value === "-")
    ) {
      const operator = currentToken.value;
      currentToken = tokens[++position];
      const rightExpression = parseTerm();
      leftExpression = {
        type: "BINARY_OP",
        operator: operator,
        left: leftExpression,
        right: rightExpression,
      };
    }

    return leftExpression;
  }

  function parseTerm() {
    let leftExpression = parseFactor();

    while (
      currentToken !== undefined &&
      (currentToken.value === "*" || currentToken.value === "/")
    ) {
      const operator = currentToken.value;
      currentToken = tokens[++position];
      const rightExpression = parseFactor();
      leftExpression = {
        type: "BINARY_OP",
        operator: operator,
        left: leftExpression,
        right: rightExpression,
      };
    }

    return leftExpression;
  }

  function parseFactor() {
    if (
      currentToken?.value === "-" ||
      mathFunctions.includes(currentToken?.value)
    ) {
      const operator = currentToken.value;
      currentToken = tokens[++position];
      const operand = parseFactor();
      return {
        type: "UNARY_OP",
        operator: operator,
        operand: operand,
      };
    }

    return parseExponentiation();
  }

  function parseExponentiation() {
    let leftExpression = parsePrimary();

    while (
      currentToken !== undefined &&
      (currentToken.value === "&" || currentToken.value === "e")
    ) {
      const operator = currentToken.value;
      currentToken = tokens[++position];
      const rightExpression = parseFactor();
      leftExpression = {
        type: "BINARY_OP",
        operator: operator,
        left: leftExpression,
        right: rightExpression,
      };
    }

    return leftExpression;
  }

  function parsePrimary() {
    if (currentToken !== undefined && currentToken.type === "NUMBER") {
      const value = parseFloat(currentToken.value);
      currentToken = tokens[++position];
      return {
        type: "VALUE",
        value: value,
      };
    }

    if (
      currentToken !== undefined &&
      currentToken.type === "PAREN" &&
      currentToken.value === "("
    ) {
      currentToken = tokens[++position];
      const innerExpression = parseExpression();

      if (
        currentToken === undefined ||
        currentToken.type !== "PAREN" ||
        currentToken.value !== ")"
      ) {
        throw new Error(`Expected closing parenthesis at position ${position}`);
      }

      currentToken = tokens[++position];
      return innerExpression;
    }

    if (currentToken !== undefined) {
      throw new Error(
        `Invalid token: ${currentToken?.value} at position ${position}. Expected a number or parenthesis`
      );
    }

    throw new Error(
      `Invalid expression: expected an expression on the right side of ${
        tokens[position - 1].value
      } at position ${position - 1}`
    );
  }

  return parseExpression();
}

function evaluateExpression(expression) {
  switch (expression.type) {
    case "VALUE":
      return expression.value;
    case "BINARY_OP":
      const left = evaluateExpression(expression.left);
      const right = evaluateExpression(expression.right);

      switch (expression.operator) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          return left / right;
        case "&":
          return Math.pow(left, right);
        case "e":
          return left * Math.pow(10, right);
        default:
          throw new Error("Invalid operator");
      }
    case "UNARY_OP":
      const operand = evaluateExpression(expression.operand);

      switch (expression.operator) {
        case "-":
          return -operand;
        case "log":
          return Math.log10(operand);
        case "ln":
          return Math.log(operand);
        case "exp":
          return Math.exp(operand);
        case "sqrt":
          return Math.sqrt(operand);
        case "abs":
          return Math.abs(operand);
        case "atan":
          return Math.atan(operand);
        case "acos":
          return Math.acos(operand);
        case "asin":
          return Math.asin(operand);
        case "sinh":
          return Math.sinh(operand);
        case "cosh":
          return Math.cosh(operand);
        case "tanh":
          return Math.tanh(operand);
        case "tan":
          return Math.tan(operand);
        case "sin":
          return Math.sin(operand);
        case "cos":
          return Math.cos(operand);
        default:
          throw new Error("Invalid operator");
      }
    default:
      throw new Error("Invalid expression");
  }
}

function evaluate(input) {
  return evaluateExpression(parse(tokenize(input)));
}