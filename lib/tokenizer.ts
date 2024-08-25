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
            // Skip whitespace characters
            currentChar = input[++position];
            continue;
        }

        if (isDigit(currentChar)) {
            let num = '';

            // Continue to read digits until we reach a non-digit character to get the left side of the possible float number
            while (currentChar !== undefined && isDigit(currentChar)) {
                num += currentChar;

                currentChar = input[++position];
            }

            // Check if the number is a float by checking if the next character is a dot
            if (currentChar === '.') {
                num += currentChar;

                currentChar = input[++position];

                // Continue to read digits after the decimal point until we reach a non-digit character
                while (currentChar !== undefined && isDigit(currentChar)) {
                    num += currentChar;

                    currentChar = input[++position];
                }

                tokens.push({ type: 'NUMBER', value: num });
            } else {
                tokens.push({ type: 'NUMBER', value: num });
            }

            continue;
        }

        if (isOperator(currentChar)) {
            tokens.push({ type: 'OPERATOR', value: currentChar });

            currentChar = input[++position];
            continue;
        }

        // We don't care if the parentheses are balanced at this point, that will be handled by the parser
        if (isParen(currentChar)) {
            tokens.push({ type: 'PAREN', value: currentChar });

            currentChar = input[++position];
            continue;
        }

        throw new Error(`Invalid character: ${currentChar} at position ${position}`);
    }

    return tokens;
}