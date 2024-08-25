import { OPERATORS } from "./tokens";

export const isDigit = (char: string) => /\d/.test(char);
export const isOperator = (char: string) => OPERATORS.includes(char);
export const isParen = (char: string) => /[\(\)]/.test(char);
export const isWhitespace = (char: string) => /\s/.test(char);
export const isAlpha = (char: string) => /[a-z]/.test(char);