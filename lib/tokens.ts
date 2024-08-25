
export enum MathFunction {
    LOG = 'log',
    LN = 'ln',
    EXP = 'exp',
    SQRT = 'sqrt',
    ABS = 'abs',
    ATAN = 'atan',
    ACOS = 'acos',
    ASIN = 'asin',
    SINH = 'sinh',
    COSH = 'cosh',
    TANH = 'tanh',
    TAN = 'tan',
    SIN = 'sin',
    COS = 'cos',
}

export enum Operator {
    ADD = '+',
    SUBTRACT = '-',
    MULTIPLY = '*',
    DIVIDE = '/',
    EXPONENT = '^',
    SCIENTIFIC = 'e',
}

export enum PAREN {
    OPEN = '(',
    CLOSE = ')',
}

export const OPERATORS: string[] = Object.values(Operator);
export const MATH_FUNCTIONS: string[] = Object.values(MathFunction);