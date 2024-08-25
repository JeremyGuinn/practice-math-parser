import { Token, tokenize } from "../lib/tokenizer";

describe("Tokenizer", () => {
    describe("Number Tokenization", () => {
        test("should tokenize a single number", () => {
            const input = "42";
            const expectedTokens: Token[] = [
                { type: 'NUMBER', value: "42" },
            ];
            expect(tokenize(input)).toEqual(expectedTokens);
        });

        test("should tokenize multiple numbers", () => {
            const input = "42 17";
            const expectedTokens: Token[] = [
                { type: 'NUMBER', value: "42" },
                { type: 'NUMBER', value: "17" },
            ];
            expect(tokenize(input)).toEqual(expectedTokens);
        });

        test("should tokenize negative numbers", () => {
            const input = "-42";
            const expectedTokens: Token[] = [
                { type: 'OPERATOR', value: "-" },
                { type: 'NUMBER', value: "42" },
            ];
            expect(tokenize(input)).toEqual(expectedTokens);
        });

        test("should tokenize numbers with decimal points", () => {
            const input = "42.17";
            const expectedTokens: Token[] = [
                { type: 'NUMBER', value: "42.17" },
            ];
            expect(tokenize(input)).toEqual(expectedTokens);
        });

        test("should throw when two decimal points are present", () => {
            const input = "42.17.42";
            expect(() => tokenize(input)).toThrow("Invalid character: . at position 5");
        });

        test("should tokenize numbers with unary minus inside parentheses", () => {
            const input = "6 + (-4)";
            const expectedTokens: Token[] = [
                { type: 'NUMBER', value: "6" },
                { type: 'OPERATOR', value: "+" },
                { type: 'PAREN', value: "(" },
                { type: 'OPERATOR', value: "-" },
                { type: 'NUMBER', value: "4" },
                { type: 'PAREN', value: ")" },
            ];
            expect(tokenize(input)).toEqual(expectedTokens);
        });
    });

    describe("Operator Tokenization", () => {
        it.each(['+', '-', '*', '/', '^'])('should tokenize operator %s', (operator) => {
            const input = operator;
            const expectedTokens: Token[] = [{ type: 'OPERATOR', value: operator }];
            expect(tokenize(input)).toEqual(expectedTokens);
        });

        test("should tokenize a single operator", () => {
            const input = "+";
            const expectedTokens: Token[] = input.split("").map((operator) => ({ type: 'OPERATOR', value: operator }));
            expect(tokenize(input)).toEqual(expectedTokens);
        });

        test("should tokenize multiple operators", () => {
            const input = "+-*/";
            const expectedTokens: Token[] = input.split("").map((operator) => ({ type: 'OPERATOR', value: operator }));
            expect(tokenize(input)).toEqual(expectedTokens);
        });
    });

    describe("Parenthesis Tokenization", () => {
        it.each(['(', ')',])('should tokenize parenthesis %s', (paren) => {
            const input = paren;
            const expectedTokens: Token[] = input.split("").map((paren) => ({ type: 'PAREN', value: paren }));
            expect(tokenize(input)).toEqual(expectedTokens);
        });

        test("should tokenize multiple parentheses", () => {
            const input = "()";
            const expectedTokens: Token[] = input.split("").map((paren) => ({ type: 'PAREN', value: paren }));
            expect(tokenize(input)).toEqual(expectedTokens);
        });

        test("should tokenize unbalanced parentheses", () => {
            const input = "((()()((()))))))(";
            const expectedTokens: Token[] = input.split("").map((paren) => ({ type: 'PAREN', value: paren }));
            expect(tokenize(input)).toEqual(expectedTokens);
        });
    });

    describe("Function Tokenization", () => {
        it.each(['log', 'ln', 'exp', 'sqrt', 'abs', 'atan', 'acos', 'asin', 'sinh', 'cosh', 'tanh', 'tan', 'sin', 'cos'])('should tokenize function %s', (func) => {
            const input = func;
            const expectedTokens: Token[] = [{ type: 'FUNCTION', value: func }];
            expect(tokenize(input)).toEqual(expectedTokens);
        });

        test("should tokenize a single function", () => {
            const input = "sin";
            const expectedTokens: Token[] = [{ type: 'FUNCTION', value: "sin" }];
            expect(tokenize(input)).toEqual(expectedTokens);
        });

        test("should tokenize multiple functions", () => {
            const input = "sin cos tan";
            const expectedTokens: Token[] = input.split(" ").map((func) => ({ type: 'FUNCTION', value: func }));
            expect(tokenize(input)).toEqual(expectedTokens);
        });

        test("should throw for an invalid function", () => {
            const input = "abc";
            expect(() => tokenize(input)).toThrow("Invalid function: abc at position 3");
        });
    });

    describe("Complex Expressions", () => {
        test("should tokenize a complex expression", () => {
            const input = "2 + 3 * (4 - 5)";
            const expectedTokens: Token[] = [
                { type: 'NUMBER', value: "2" },
                { type: 'OPERATOR', value: "+" },
                { type: 'NUMBER', value: "3" },
                { type: 'OPERATOR', value: "*" },
                { type: 'PAREN', value: "(" },
                { type: 'NUMBER', value: "4" },
                { type: 'OPERATOR', value: "-" },
                { type: 'NUMBER', value: "5" },
                { type: 'PAREN', value: ")" },
            ];
            expect(tokenize(input)).toEqual(expectedTokens);
        });

        test("should tokenize an expression with negative numbers", () => {
            const input = "6 + -(4)";
            const expectedTokens: Token[] = [
                { type: 'NUMBER', value: "6" },
                { type: 'OPERATOR', value: "+" },
                { type: 'OPERATOR', value: "-" },
                { type: 'PAREN', value: "(" },
                { type: 'NUMBER', value: "4" },
                { type: 'PAREN', value: ")" },
            ];
            expect(tokenize(input)).toEqual(expectedTokens);
        });
    });

    describe("Error Handling", () => {
        test("should throw an error for a token not in the grammar", () => {
            const input = "2 + $";
            expect(() => tokenize(input)).toThrow("Invalid character: $ at position 4");
        });
    });
});