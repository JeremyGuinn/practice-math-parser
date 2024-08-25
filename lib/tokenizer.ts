export type TokenType = 'NUMBER' | 'OPERATOR' | 'PAREN';
export type Operator = '+' | '-' | '*' | '/';

export type Token = {
    type: TokenType;
    value: string;
};

const isDigit = (char: string) => /\d/.test(char);
const isOperator = (char: string) => /[\+\-\*\/]/.test(char);
const isParen = (char: string) => /[\(\)]/.test(char);
const isWhitespace = (char: string) => /\s/.test(char);

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

        if (isOperator(currentChar)) {
            tokens.push({ type: 'OPERATOR', value: currentChar });
            currentChar = input[++position];
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