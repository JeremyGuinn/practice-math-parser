import { Expression, parse } from "./parser";
import { tokenize } from "./tokenizer";

export function evaluateExpression(expression: Expression): number {
    switch (expression.type) {
        case 'VALUE':
            return expression.value;
        case 'BINARY_OP':
            const left = evaluateExpression(expression.left);
            const right = evaluateExpression(expression.right);

            switch (expression.operator) {
                case '+':
                    return left + right;
                case '-':
                    return left - right;
                case '*':
                    return left * right;
                case '/':
                    return left / right;
                default:
                    throw new Error('Invalid operator');
            }
        case 'UNARY_OP':
            const operand = evaluateExpression(expression.operand);

            switch (expression.operator) {
                case '-':
                    return -operand;
                default:
                    throw new Error('Invalid operator');
            }
        default:
            throw new Error('Invalid expression');
    }
}

export function evaluate(input: string): number {
    return evaluateExpression(parse(tokenize(input)));
}
