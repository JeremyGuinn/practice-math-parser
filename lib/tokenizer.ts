import { Operator, MATH_FUNCTIONS } from './tokens';
import { isDigit, isOperator, isParen, isWhitespace, isAlpha } from './matchers';

export type TokenType = 'NUMBER' | 'OPERATOR' | 'PAREN' | 'FUNCTION';

export type Token = {
    type: TokenType;
    value: string;
};

export function tokenize(input: string): Token[] {
    const tokens: Token[] = [];

    let position = 0;
    let currentChar = input[position];

    while (currentChar !== undefined) {
        if (isWhitespace(currentChar)) {
            currentChar = input[++position];
            continue;
        }

        if (isDigit(currentChar)) {
            let num = '';

            // Read to the left of a possible decimal point
            while (isDigit(currentChar)) {
                num += currentChar;
                currentChar = input[++position];
            }

            // Read the decimal point and the right side of the number
            if (currentChar === '.') {
                num += currentChar;
                currentChar = input[++position];

                while (isDigit(currentChar)) {
                    num += currentChar;
                    currentChar = input[++position];
                }
            }

            tokens.push({ type: 'NUMBER', value: num });
            continue;
        }

        if (isAlpha(currentChar)) {
            let func = '';

            while (currentChar && isAlpha(currentChar)) {
                func += currentChar;
                currentChar = input[++position];
            }

            if (!MATH_FUNCTIONS.includes(func.toLowerCase())) {
                throw new Error(`Invalid function: ${func} at position ${position}`);
            }

            tokens.push({ type: 'FUNCTION', value: func.toLowerCase() });
            continue;
        }

        if (isOperator(currentChar)) {
            let operatorCount = 0;

            if (currentChar === Operator.SUBTRACT) {
                while (currentChar === Operator.SUBTRACT) {
                    operatorCount++;
                    currentChar = input[++position];
                }

                if (operatorCount % 2 === 0) {

                    tokens.push({ type: 'OPERATOR', value: Operator.ADD });
                } else {
                    tokens.push({ type: 'OPERATOR', value: Operator.SUBTRACT });
                }
            } else {
                tokens.push({ type: 'OPERATOR', value: currentChar });
                currentChar = input[++position];
            }

            continue;
        }

        if (isParen(currentChar)) {
            tokens.push({ type: 'PAREN', value: currentChar });
            currentChar = input[++position];
            continue;
        }

        throw new Error(`Invalid character: ${currentChar} at position ${position}`);
    }

    return tokens;
}