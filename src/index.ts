// istanbul ignore file
import { tokenize } from '../lib/tokenizer';
import { parse } from '../lib/parser';
import { evaluate } from '../lib/evaluator';

const expressions = [
    '-3'
].forEach(expression => {
    console.log('Expression:', expression);

    const tokens = tokenize(expression);
    console.log('Tokens:', tokens);

    const parsed = parse(tokens);
    console.log('Parsed:', parsed);

    const result = evaluate(expression);
    console.log('Result:', result);
});