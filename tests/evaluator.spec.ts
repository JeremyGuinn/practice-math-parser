import { evaluate, evaluateExpression } from "../lib/evaluator";
import { BinaryOperatorExpression, UnaryOperatorExpression, ValueExpression } from "../lib/parser";

describe("Evaluator", () => {
    describe("Value Evaluation", () => {
        test("should evaluate a single number", () => {
            const expression: ValueExpression = { type: "VALUE", value: 42 };
            expect(evaluateExpression(expression)).toBe(42);
        });

        test("should evaluate a negative number", () => {
            const expression: UnaryOperatorExpression = { type: "UNARY_OP", operator: "-", operand: { type: "VALUE", value: 42 } };
            expect(evaluateExpression(expression)).toBe(-42);
        });

        test("should evaluate a number with a decimal point", () => {
            const expression: ValueExpression = { type: "VALUE", value: 42.17 };
            expect(evaluateExpression(expression)).toBe(42.17);
        });

        test("should evaluate a negative number with a decimal point", () => {
            const expression: UnaryOperatorExpression = { type: "UNARY_OP", operator: "-", operand: { type: "VALUE", value: 42.17 } };
            expect(evaluateExpression(expression)).toBe(-42.17);
        });
    });

    describe("Binary Operation Evaluation", () => {
        it.each([
            ["+", 2, 3, 5],
            ["-", 5, 3, 2],
            ["*", 2, 3, 6],
            ["/", 6, 3, 2],
        ])("should evaluate %s", (operator, left, right, expected) => {
            const expression: BinaryOperatorExpression = {
                type: "BINARY_OP",
                operator: operator,
                left: { type: "VALUE", value: left },
                right: { type: "VALUE", value: right },
            };
            expect(evaluateExpression(expression)).toBe(expected);
        });

        test("should return positive infinity when dividing by zero", () => {
            const expression: BinaryOperatorExpression = {
                type: "BINARY_OP",
                operator: "/",
                left: { type: "VALUE", value: 1 },
                right: { type: "VALUE", value: 0 },
            };
            expect(evaluateExpression(expression)).toBe(Number.POSITIVE_INFINITY);
        });

        test("should throw when operator is invalid", () => {
            const expression: BinaryOperatorExpression = {
                type: "BINARY_OP",
                operator: "%",
                left: { type: "VALUE", value: 1 },
                right: { type: "VALUE", value: 1 },
            };
            expect(() => evaluateExpression(expression)).toThrow("Invalid operator");
        });
    });

    describe("Error Handling", () => {
        it('should throw for invalid binary operator', () => {
            const expression: BinaryOperatorExpression = {
                type: "BINARY_OP",
                operator: "%",
                left: { type: "VALUE", value: 1 },
                right: { type: "VALUE", value: 1 },
            };
            expect(() => evaluateExpression(expression)).toThrow("Invalid operator");
        });

        it('should throw for invalid unary operator', () => {
            const expression: UnaryOperatorExpression = {
                type: "UNARY_OP",
                operator: "%",
                operand: { type: "VALUE", value: 1 },
            };
            expect(() => evaluateExpression(expression)).toThrow("Invalid operator");
        });

        it('should throw for invalid expression', () => {
            const expression = { type: "INVALID" } as any;
            expect(() => evaluateExpression(expression)).toThrow("Invalid expression");
        });
    });

    describe("Expression Evaluation", () => {
        it.each([
            ["1 + 2", 3],
            ["5 - 3", 2],
            ["4 * 6", 24],
            ["8 / 2", 4],
            ["-5 + 3", -2],
            ["-7 - 8", -15],
            ["-4 * 3", -12],
            ["-16 / 4", -4],
            ["(2 + 3) * 4", 20],
            ["(7 - 5) / 2", 1],
            ["5 * (3 + 2)", 25],
            ["4 / (1 + 1)", 2],
            ["(2 + 3) * (7 - 4)", 15],
            ["(6 / 2) + 5", 8],
            ["10 - (3 + 2)", 5],
            ["-(5 + 2)", -7],
            ["-3 * (2 + 4)", -18],
            ["-(2 + 3) * (4 - 1)", -15],
            ["(2 + (3 * 4)) / 2", 7],
            ["3 + (-4 * 2)", -5],
            ["((2 + 3) * (4 + 1)) - 7", 18],
            ["-((5 - 2) * (3 + 4))", -21],
            ["-(-3 + 7)", -4],
            ["(2 + 3) * (-(4 - 7))", 15],
            ["-(-(4 + 1) * (2 + 3))", 25],
            ["(3 * (2 + (4 * (1 + 1))))", 30],
            ["10 / (5 - (2 + 3))", Number.POSITIVE_INFINITY],
            ["-((2 + 4) * (3 - 5))", 12],
            ["3 + ((2 * 4) / (1 - (-3)))", 5],
            ["-((7 - 3) * (2 + 2) / 2)", -8]
        ])("should evaluate %s", (input, expected) => {
            expect(evaluate(input)).toBe(expected);
        });
    });
});