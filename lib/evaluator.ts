import { Expression, parse } from "./parser";
import { tokenize } from "./tokenizer";
import { MathFunction, Operator } from "./tokens";

export function evaluateExpression(expression: Expression): number {
    switch (expression.type) {
        case 'VALUE':
            return expression.value;
        case 'BINARY_OP':
            const left = evaluateExpression(expression.left);
            const right = evaluateExpression(expression.right);

            switch (expression.operator) {
                case Operator.ADD:
                    return left + right;
                case Operator.SUBTRACT:
                    return left - right;
                case Operator.MULTIPLY:
                    return left * right;
                case Operator.DIVIDE:
                    return left / right;
                case Operator.EXPONENT:
                    return Math.pow(left, right);
                case Operator.SCIENTIFIC:
                    return left * Math.pow(10, right);
                default:
                    throw new Error('Invalid operator');
            }
        case 'UNARY_OP':
            const operand = evaluateExpression(expression.operand);

            switch (expression.operator) {
                case Operator.SUBTRACT:
                    return -operand;
                case Operator.ADD:
                    return operand;
                case MathFunction.LOG:
                    return Math.log10(operand);
                case MathFunction.LN:
                    return Math.log(operand);
                case MathFunction.EXP:
                    return Math.exp(operand);
                case MathFunction.SQRT:
                    return Math.sqrt(operand);
                case MathFunction.ABS:
                    return Math.abs(operand);
                case MathFunction.ATAN:
                    return Math.atan(operand);
                case MathFunction.ACOS:
                    return Math.acos(operand);
                case MathFunction.ASIN:
                    return Math.asin(operand);
                case MathFunction.SINH:
                    return Math.sinh(operand);
                case MathFunction.COSH:
                    return Math.cosh(operand);
                case MathFunction.TANH:
                    return Math.tanh(operand);
                case MathFunction.TAN:
                    return Math.tan(operand);
                case MathFunction.SIN:
                    return Math.sin(operand);
                case MathFunction.COS:
                    return Math.cos(operand);
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
