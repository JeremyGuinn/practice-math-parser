import { parse, Expression } from "../lib/parser";
import { Token } from "../lib/tokenizer";

describe("Parser", () => {
    describe("Binary Operator Parsing", () => {
        it.each(['+', '-', '*', '/'])('should parse operator %s', (operator) => {
            const tokens: Token[] = [
                { type: "NUMBER", value: "2" },
                { type: "OPERATOR", value: operator },
                { type: "NUMBER", value: "3" },
            ];
            const expectedExpression: Expression = {
                type: "BINARY_OP",
                operator: operator,
                left: { type: "VALUE", value: 2 },
                right: { type: "VALUE", value: 3 },
            };
            const result = parse(tokens);
            expect(result).toEqual(expectedExpression);
        });
    });

    describe("Unary Operator Parsing", () => {
        it.each(['-'])('should parse unary operator %s', (operator) => {
            const tokens: Token[] = [
                { type: "OPERATOR", value: operator },
                { type: "NUMBER", value: "2" },
            ];
            const expectedExpression: Expression = {
                type: "UNARY_OP",
                operator: operator,
                operand: { type: "VALUE", value: 2 },
            };
            const result = parse(tokens);
            expect(result).toEqual(expectedExpression);
        });
    });

    describe("Value Parsing", () => {
        it("should parse a number", () => {
            const tokens: Token[] = [{ type: "NUMBER", value: "2" }];
            const expectedExpression: Expression = { type: "VALUE", value: 2 };
            const result = parse(tokens);
            expect(result).toEqual(expectedExpression);
        });

        it("should parse a negative number", () => {
            const tokens: Token[] = [
                { type: "OPERATOR", value: "-" },
                { type: "NUMBER", value: "2" },
            ];
            const expectedExpression: Expression = { type: "UNARY_OP", operator: "-", operand: { type: "VALUE", value: 2 } };
            const result = parse(tokens);
            expect(result).toEqual(expectedExpression);
        });

        it("should parse a number with a decimal point", () => {
            const tokens: Token[] = [{ type: "NUMBER", value: "2.5" }];
            const expectedExpression: Expression = { type: "VALUE", value: 2.5 };
            const result = parse(tokens);
            expect(result).toEqual(expectedExpression);
        });

        it("should parse a negative number with a decimal point", () => {
            const tokens: Token[] = [
                { type: "OPERATOR", value: "-" },
                { type: "NUMBER", value: "2.523" },
            ];
            const expectedExpression: Expression = { type: "UNARY_OP", operator: "-", operand: { type: "VALUE", value: 2.523 } };
            const result = parse(tokens);
            expect(result).toEqual(expectedExpression);
        });
    });

    describe("Parentheses Parsing", () => {
        it("should parse an expression inside parentheses", () => {
            const tokens: Token[] = [
                { type: "PAREN", value: "(" },
                { type: "NUMBER", value: "2" },
                { type: "OPERATOR", value: "+" },
                { type: "NUMBER", value: "3" },
                { type: "PAREN", value: ")" },
            ];
            const expectedExpression: Expression = {
                type: "BINARY_OP",
                operator: "+",
                left: { type: "VALUE", value: 2 },
                right: { type: "VALUE", value: 3 },
            };
            const result = parse(tokens);
            expect(result).toEqual(expectedExpression);
        });

        it("should throw an error for missing closing parenthesis", () => {
            const tokens: Token[] = [
                { type: "PAREN", value: "(" },
                { type: "NUMBER", value: "2" },
                { type: "OPERATOR", value: "+" },
                { type: "NUMBER", value: "3" },
            ];
            expect(() => parse(tokens)).toThrow("Expected closing parenthesis at position 4");
        });

        it("should throw for unbalanced parentheses", () => {
            const tokens: Token[] = [
                { type: "PAREN", value: "(" },
                { type: "NUMBER", value: "1" },
                { type: "OPERATOR", value: "+" },
                { type: "OPERATOR", value: "-" },
                { type: "NUMBER", value: "20" },
                { type: "OPERATOR", value: "+" },
                { type: "NUMBER", value: "3" },
                { type: "PAREN", value: ")" },
                { type: "PAREN", value: ")" },
                { type: "PAREN", value: ")" },
            ];
            expect(() => parse(tokens)).toThrow("Unexpected token ) at position 8");
        });
    });

    describe("Error Handling", () => {
        it("should throw for an incomplete expression", () => {
            const tokens: Token[] = [
                { type: "PAREN", value: "(" },
                { type: "NUMBER", value: "2" },
                { type: "OPERATOR", value: "+" },
            ];
            expect(() => parse(tokens)).toThrow();
        });

        it("should throw an error for invalid token", () => {
            const tokens: Token[] = [
                { type: "OPERATOR", value: "%" },
            ];
            expect(() => parse(tokens)).toThrow("Invalid token: % at position 0. Expected a number or parenthesis");
        });

        it("should throw an error for invalid expression", () => {
            const tokens: Token[] = [
                { type: "NUMBER", value: "2" },
                { type: "OPERATOR", value: "+" },
            ];
            expect(() => parse(tokens)).toThrow("Invalid expression: expected an expression on the right side of + at position 1");
        });
    });
});