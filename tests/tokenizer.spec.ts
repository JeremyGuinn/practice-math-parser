import { tokenize } from '../src/tokenizer';

describe('Tokenizer', () => {
    it('should tokenize a simple expression', () => {
        const input = '2 + 3 * 4';
        const expectedTokens = [
            { type: 'NUMBER', value: '2' },
            { type: 'OPERATOR', value: '+' },
            { type: 'NUMBER', value: '3' },
            { type: 'OPERATOR', value: '*' },
            { type: 'NUMBER', value: '4' },
        ];

        expect(tokenize(input)).toEqual(expectedTokens);
    });

    it('should tokenize an expression with parentheses', () => {
        const input = '(2 + 3) * 4';
        const expectedTokens = [
            { type: 'PAREN', value: '(' },
            { type: 'NUMBER', value: '2' },
            { type: 'OPERATOR', value: '+' },
            { type: 'NUMBER', value: '3' },
            { type: 'PAREN', value: ')' },
            { type: 'OPERATOR', value: '*' },
            { type: 'NUMBER', value: '4' },
        ];

        expect(tokenize(input)).toEqual(expectedTokens);
    });

    it('should tokenize an expression with floating-point numbers', () => {
        const input = '2.5 + 3.75';
        const expectedTokens = [
            { type: 'NUMBER', value: '2.5' },
            { type: 'OPERATOR', value: '+' },
            { type: 'NUMBER', value: '3.75' },
        ];

        expect(tokenize(input)).toEqual(expectedTokens);
    });

    it('should tokenize an expression with extra whitespace', () => {
        const input = '  2  +  3  ';
        const expectedTokens = [
            { type: 'NUMBER', value: '2' },
            { type: 'OPERATOR', value: '+' },
            { type: 'NUMBER', value: '3' }
        ];

        expect(tokenize(input)).toEqual(expectedTokens);
    });

    it('should throw for an invalid character', () => {
        const input = '2 + x';
        expect(() => tokenize(input)).toThrow();
    });
});