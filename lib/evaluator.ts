import { Expression, parse } from "./parser";
import { tokenize } from "./tokenizer";

export function evaluateExpression(expression: Expression): number {
    switch (expression.type) {
        case 'VALUE':
            return expression.value;
        case 'OPERATOR':
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
        default:
            throw new Error('Invalid expression');
    }
}

export function evaluate(input: string): number {
    return evaluateExpression(parse(tokenize(input)));
}
