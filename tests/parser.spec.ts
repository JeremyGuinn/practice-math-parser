import { parse, Expression } from "../src/parser";
import { Token } from "../src/tokenizer";

describe("Parser", () => {
    it("should parse a simple addition expression", () => {
        const tokens: Token[] = [
            { type: 'NUMBER', value: "2" },
            { type: 'OPERATOR', value: "+" },
            { type: 'NUMBER', value: "3" },
        ];
        const expectedExpression: Expression = {
            type: "OPERATOR",
            operator: "+",
            left: { type: "VALUE", value: 2 },
            right: { type: "VALUE", value: 3 },
        };
        const result = parse(tokens);
        expect(result).toEqual(expectedExpression);
    });

    it("should parse a complex expression with multiple operators", () => {
        const tokens: Token[] = [
            { type: 'NUMBER', value: "2" },
            { type: 'OPERATOR', value: "+" },
            { type: 'NUMBER', value: "3" },
            { type: 'OPERATOR', value: "*" },
            { type: 'NUMBER', value: "4" },
            { type: 'OPERATOR', value: "-" },
            { type: 'NUMBER', value: "5" },
        ];
        const expectedExpression: Expression = {
            type: "OPERATOR",
            operator: "-",
            left: {
                type: "OPERATOR",
                operator: "+",
                left: { type: "VALUE", value: 2 },
                right: {
                    type: "OPERATOR",
                    operator: "*",
                    left: { type: "VALUE", value: 3 },
                    right: { type: "VALUE", value: 4 },
                },
            },
            right: { type: "VALUE", value: 5 },
        };
        const result = parse(tokens);
        expect(result).toEqual(expectedExpression);
    });

    it("should throw an error for an incomplete expression", () => {
        const tokens: Token[] = [
            { type: 'NUMBER', value: "2" },
            { type: 'OPERATOR', value: "+" },
        ];
        expect(() => parse(tokens)).toThrow();
    });

    it("should throw for missing parentheses", () => {
        const tokens: Token[] = [
            { type: 'PAREN', value: "(" },
            { type: 'NUMBER', value: "2" },
            { type: 'OPERATOR', value: "+" },
            { type: 'NUMBER', value: "3" },
        ];
        expect(() => parse(tokens)).toThrow();
    });

    it("should throw when there are extra tokens", () => {
        const tokens: Token[] = [
            { type: 'NUMBER', value: "2" },
            { type: 'OPERATOR', value: "+" },
            { type: 'NUMBER', value: "3" },
            { type: 'OPERATOR', value: "*" },
        ];
        expect(() => parse(tokens)).toThrow();
    });
});