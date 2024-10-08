import { Token } from "./tokenizer";
import { MATH_FUNCTIONS, Operator, PAREN } from "./tokens";

export interface ValueExpression {
    type: 'VALUE';
    value: number;
};

export interface BinaryOperatorExpression {
    type: 'BINARY_OP';
    operator: string;
    left: Expression;
    right: Expression;
};

export interface UnaryOperatorExpression {
    type: 'UNARY_OP';
    operator: string;
    operand: Expression;
};

export type Expression = ValueExpression | BinaryOperatorExpression | UnaryOperatorExpression;

/**
 * A recursive descent parser to parse the tokens into an expression tree
 * This parser uses the following grammar:
 * 
 * - expression := term { ('+' | '-') term }
 * - term := factor { ('*' | '/') factor }
 * - factor := unaryOp factor | primary
 * - unaryOp := '-' | '+'
 * - primary := number | '(' expression ')' | function
 * - number := [0-9]+
 * - function := mathFunction '(' expression ')'
 * - mathFunction := 'log' | 'ln' | 'exp' | 'sqrt' | 'abs' | 'atan' | 'acos' | 'asin' | 'sinh' | 'cosh' | 'tanh' | 'tan'
 * 
 * The grammar is left-associative, meaning that the expression 2 + 3 + 4 is parsed as (2 + 3) + 4
 * 
 * The parser uses the following precedence rules:
 * 1. Parentheses
 * 2. Exponentiation
 * 3. Unary operators (+, -)
 * 4. Multiplication and division
 * 5. Addition and subtraction
 * 
 * @param tokens Array of tokens to parse into an expression tree. The tokens should be generated by the tokenizer.
 * @returns The expression tree representing the input tokens.
 * @throws An error if the input tokens are invalid, or if the expression is incomplete.
 */
export function parse(tokens: Token[]): Expression {
    let position = 0;
    let currentToken = tokens[position];

    function parseExpression(): Expression {
        let leftExpression = parseTerm();

        while (currentToken !== undefined && (currentToken.value === Operator.ADD || currentToken.value === Operator.SUBTRACT)) {
            const operator = currentToken.value;
            currentToken = tokens[++position];
            const rightExpression = parseTerm();
            leftExpression = {
                type: 'BINARY_OP',
                operator: operator,
                left: leftExpression,
                right: rightExpression
            };
        }

        return leftExpression;
    }

    function parseTerm(): Expression {
        let leftExpression = parseFactor();

        while (currentToken !== undefined && (currentToken.value === Operator.MULTIPLY || currentToken.value === Operator.DIVIDE)) {
            const operator = currentToken.value;
            currentToken = tokens[++position];
            const rightExpression = parseFactor();
            leftExpression = {
                type: 'BINARY_OP',
                operator: operator,
                left: leftExpression,
                right: rightExpression
            };
        }

        return leftExpression;
    }

    function parseFactor(): Expression {
        if (currentToken?.value === Operator.SUBTRACT || currentToken?.value === Operator.ADD || MATH_FUNCTIONS.includes(currentToken?.value)) {
            const operator = currentToken.value;
            currentToken = tokens[++position];
            const operand = parseFactor();
            return {
                type: 'UNARY_OP',
                operator: operator,
                operand: operand
            };
        }

        return parseExponentiation();
    }

    function parseExponentiation(): Expression {
        let leftExpression = parsePrimary();

        while (currentToken !== undefined && (currentToken.value === Operator.EXPONENT || currentToken.value === Operator.SCIENTIFIC)) {
            const operator = currentToken.value;
            currentToken = tokens[++position];
            const rightExpression = parseFactor();
            leftExpression = {
                type: 'BINARY_OP',
                operator: operator,
                left: leftExpression,
                right: rightExpression
            };
        }

        return leftExpression;
    }

    function parsePrimary(): Expression {
        if (currentToken !== undefined && currentToken.type === 'NUMBER') {
            const value = parseFloat(currentToken.value);
            currentToken = tokens[++position];
            return {
                type: 'VALUE',
                value: value
            };
        }

        if (currentToken !== undefined && currentToken.type === 'PAREN' && currentToken.value === PAREN.OPEN) {
            currentToken = tokens[++position];
            const innerExpression = parseExpression();

            if (currentToken === undefined || (currentToken.type !== 'PAREN' || currentToken.value !== PAREN.CLOSE)) {
                throw new Error(`Expected closing parenthesis at position ${position}`);
            }

            currentToken = tokens[++position];
            return innerExpression;
        }

        if (currentToken !== undefined) {
            throw new Error(`Invalid token: ${currentToken?.value} at position ${position}. Expected a number or parenthesis`);
        }

        throw new Error(
            `Invalid expression: expected an expression on the right side of ${tokens[position - 1].value
            } at position ${position - 1}`
        );
    }

    const result = parseExpression();

    if (currentToken !== undefined) {
        throw new Error(`Unexpected token ${currentToken.value} at position ${position}`);
    }

    return result;
}