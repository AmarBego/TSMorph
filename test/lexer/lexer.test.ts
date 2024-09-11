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

    it('handles whitespace correctly', () => {
        const input = '   let    x   =   42   ;   ';
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

    it('handles empty input', () => {
        const input = '';
        const tokens = lexer(input);
        expect(tokens).to.deep.equal([]);
    });

    it('handles single character tokens', () => {
        const input = '+-*/=;';
        const tokens = lexer(input);
        const tokenStrings = tokens.map(tokenToString);
        expect(tokenStrings).to.deep.equal([
            'PLUS(+)',
            'MINUS(-)',
            'ASTERISK(*)',
            'SLASH(/)',
            'EQUALS(=)',
            'SEMICOLON(;)',
        ]);
    });

    it('logs errors correctly', () => {
        const input = 'let x = 42 @';
        let errorLogged = false;
        const originalLog = console.log;
        console.log = (message: string) => {
            if (message.includes('Error: Unexpected token at position 11')) {
                errorLogged = true;
            }
        };
        try {
            lexer(input);
        } catch (e) {
            // Expected error
        }
        console.log = originalLog;
        expect(errorLogged).to.be.true;
    });
});