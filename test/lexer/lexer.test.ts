import { expect } from 'chai';
import { lexer } from '../../src/lexer/lexer';
import { Token } from '../../src/lexer/token';
import { LexerError } from '../../src/lexer/lexerError';

function tokenToString(token: Token): string {
    return `${token.type}(${token.value})`;
}

describe('Lexer', () => {
    function expectTokens(input: string, expectedTokens: string[]) {
        const tokens = lexer(input);
        const tokenStrings = tokens.map(tokenToString);
        expect(tokenStrings.length - 1).to.equal(expectedTokens.length);
        for (let i = 0; i < expectedTokens.length; i++) {
            expect(tokenStrings[i]).to.equal(expectedTokens[i]);
        }
        expect(tokenStrings[tokenStrings.length - 1]).to.equal('EOF()');
    }

    it('tokenizes identifiers and numbers', () => {
        const input = 'let x = 42;';
        expectTokens(input, [
            'IDENTIFIER(let)',
            'IDENTIFIER(x)',
            'EQUALS(=)',
            'NUMBER(42)',
            'SEMICOLON(;)'
        ]);
    });

    it('tokenizes operators', () => {
        const input = 'x + y - z * 2 / 1;';
        expectTokens(input, [
            'IDENTIFIER(x)',
            'PLUS(+)',
            'IDENTIFIER(y)',
            'MINUS(-)',
            'IDENTIFIER(z)',
            'ASTERISK(*)',
            'NUMBER(2)',
            'SLASH(/)',
            'NUMBER(1)',
            'SEMICOLON(;)'
        ]);
    });

    it('tokenizes multi-character operators', () => {
        const input = 'x == y != z <= 2 >= 1;';
        expectTokens(input, [
            'IDENTIFIER(x)',
            'EQUALS_EQUALS(==)',
            'IDENTIFIER(y)',
            'NOT_EQUALS(!=)',
            'IDENTIFIER(z)',
            'LESS_EQUALS(<=)',
            'NUMBER(2)',
            'GREATER_EQUALS(>=)',
            'NUMBER(1)',
            'SEMICOLON(;)'
        ]);
    });

    it('tokenizes string literals', () => {
        const input = 'let str = "hello \\"world\\"";';
        expectTokens(input, [
            'IDENTIFIER(let)',
            'IDENTIFIER(str)',
            'EQUALS(=)',
            'STRING("hello \\"world\\"")',
            'SEMICOLON(;)'
        ]);
    });

    it('handles comments', () => {
        const input = 'let x = 42; // this is a comment\n/* multi-line\ncomment */';
        expectTokens(input, [
            'IDENTIFIER(let)',
            'IDENTIFIER(x)',
            'EQUALS(=)',
            'NUMBER(42)',
            'SEMICOLON(;)'
        ]);
    });

    it('throws error on unexpected character', () => {
        const input = 'let x = 42 @';
        expect(() => lexer(input)).to.throw(LexerError);
        expect(() => lexer(input)).to.throw('Unexpected character: @');
    });

    it('handles whitespace correctly', () => {
        const input = '   let    x   =   42   ;   ';
        expectTokens(input, [
            'IDENTIFIER(let)',
            'IDENTIFIER(x)',
            'EQUALS(=)',
            'NUMBER(42)',
            'SEMICOLON(;)'
        ]);
    });

    it('handles empty input', () => {
        const input = '';
        const tokens = lexer(input);
        expect(tokens.length).to.equal(1);
        expect(tokenToString(tokens[0])).to.equal('EOF()');
    });

    it('handles single character tokens', () => {
        const input = '+-*/=;';
        expectTokens(input, [
            'PLUS(+)',
            'MINUS(-)',
            'ASTERISK(*)',
            'SLASH(/)',
            'EQUALS(=)',
            'SEMICOLON(;)'
        ]);
    });

    it('handles parentheses and braces', () => {
        const input = '(x + y) * {z - 1};';
        expectTokens(input, [
            'LEFT_PAREN(()',
            'IDENTIFIER(x)',
            'PLUS(+)',
            'IDENTIFIER(y)',
            'RIGHT_PAREN())',
            'ASTERISK(*)',
            'LEFT_BRACE({)',
            'IDENTIFIER(z)',
            'MINUS(-)',
            'NUMBER(1)',
            'RIGHT_BRACE(})',
            'SEMICOLON(;)'
        ]);
    });

    it('handles floating-point numbers', () => {
        const input = '3.14 + 2.5;';
        expectTokens(input, [
            'NUMBER(3.14)',
            'PLUS(+)',
            'NUMBER(2.5)',
            'SEMICOLON(;)'
        ]);
    });

    it('handles multiple statements', () => {
        const input = 'let x = 5; let y = 10; x + y;';
        expectTokens(input, [
            'IDENTIFIER(let)',
            'IDENTIFIER(x)',
            'EQUALS(=)',
            'NUMBER(5)',
            'SEMICOLON(;)',
            'IDENTIFIER(let)',
            'IDENTIFIER(y)',
            'EQUALS(=)',
            'NUMBER(10)',
            'SEMICOLON(;)',
            'IDENTIFIER(x)',
            'PLUS(+)',
            'IDENTIFIER(y)',
            'SEMICOLON(;)'
        ]);
    });
});