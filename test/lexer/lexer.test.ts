import { expect } from 'chai';
import { lexer, Token } from '../../src/lexer';

function tokenToString(token: Token): string {
    return `${token.type}(${token.value})`;
}

describe('Lexer', () => {
    it('tokenizes identifiers and numbers', () => {
        const input = 'let x = 42;';
        const tokens = lexer(input);
        const tokenStrings = tokens.map(tokenToString);
        expect(tokenStrings).to.deep.equal([
            'IDENTIFIER(let)',
            'IDENTIFIER(x)',
            'EQUALS(=)',
            'NUMBER(42)',
            'SEMICOLON(;)',
        ]);
    });

    it('tokenizes operators', () => {
        const input = 'x + y - z * 2 / 1;';
        const tokens = lexer(input);
        const tokenStrings = tokens.map(tokenToString);
        expect(tokenStrings).to.deep.equal([
            'IDENTIFIER(x)',
            'PLUS(+)',
            'IDENTIFIER(y)',
            'MINUS(-)',
            'IDENTIFIER(z)',
            'ASTERISK(*)',
            'NUMBER(2)',
            'SLASH(/)',
            'NUMBER(1)',
            'SEMICOLON(;)',
        ]);
    });

    it('throws error on unexpected token', () => {
        const input = 'let x = 42 @';
        expect(() => lexer(input)).to.throw('Unexpected token at position 11');
    });
});