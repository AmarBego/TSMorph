import { expect } from 'chai';
import { lexer } from '../../src/lexer/lexer';
import { Token } from '../../src/lexer/token';
import { LexerError } from '../../src/lexer/lexerError';
import { TokenType } from '../../src/lexer/tokenTypes';

function tokenToString(token: Token): string {
    return `${TokenType[token.type]}(${token.value})`;
}

describe('Lexer', () => {
    function expectTokens(input: string, expectedTokens: string[]) {
        const tokens = lexer(input);
        const tokenStrings = tokens.map(tokenToString);
        console.log('Actual tokens:', tokenStrings);
        console.log('Expected tokens:', expectedTokens);
        expect(tokenStrings.length - 1).to.equal(expectedTokens.length);
        for (let i = 0; i < expectedTokens.length; i++) {
            expect(tokenStrings[i]).to.equal(expectedTokens[i]);
        }
        expect(tokenStrings[tokenStrings.length - 1]).to.equal(`${TokenType.EOF}()`);
    }

    it('tokenizes identifiers and numbers', () => {
        const input = 'let x = 42;';
        expectTokens(input, [
            `${TokenType.IDENTIFIER}(let)`,
            `${TokenType.IDENTIFIER}(x)`,
            `${TokenType.EQUALS}(=)`,
            `${TokenType.NUMBER}(42)`,
            `${TokenType.SEMICOLON}(;)`
        ]);
    });

    it('tokenizes operators', () => {
        const input = 'x + y - z * 2 / 1;';
        expectTokens(input, [
            `${TokenType.IDENTIFIER}(x)`,
            `${TokenType.PLUS}(+)`,
            `${TokenType.IDENTIFIER}(y)`,
            `${TokenType.MINUS}(-)`,
            `${TokenType.IDENTIFIER}(z)`,
            `${TokenType.ASTERISK}(*)`,
            `${TokenType.NUMBER}(2)`,
            `${TokenType.SLASH}(/)`,
            `${TokenType.NUMBER}(1)`,
            `${TokenType.SEMICOLON}(;)`
        ]);
    });

    it('tokenizes multi-character operators', () => {
        const input = 'x == y != z <= 2 >= 1;';
        expectTokens(input, [
            `${TokenType.IDENTIFIER}(x)`,
            `${TokenType.EQUALS_EQUALS}(==)`,
            `${TokenType.IDENTIFIER}(y)`,
            `${TokenType.NOT_EQUALS}(!=)`,
            `${TokenType.IDENTIFIER}(z)`,
            `${TokenType.LESS_EQUALS}(<=)`,
            `${TokenType.NUMBER}(2)`,
            `${TokenType.GREATER_EQUALS}(>=)`,
            `${TokenType.NUMBER}(1)`,
            `${TokenType.SEMICOLON}(;)`
        ]);
    });

    it('tokenizes string literals', () => {
        const input = 'let str = "hello \\"world\\"";';
        expectTokens(input, [
            `${TokenType.IDENTIFIER}(let)`,
            `${TokenType.IDENTIFIER}(str)`,
            `${TokenType.EQUALS}(=)`,
            `${TokenType.STRING}("hello \\"world\\"")`,
            `${TokenType.SEMICOLON}(;)`
        ]);
    });

    it('handles comments', () => {
        const input = 'let x = 42; // this is a comment\n/* multi-line\ncomment */';
        expectTokens(input, [
            `${TokenType.IDENTIFIER}(let)`,
            `${TokenType.IDENTIFIER}(x)`,
            `${TokenType.EQUALS}(=)`,
            `${TokenType.NUMBER}(42)`,
            `${TokenType.SEMICOLON}(;)`
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
            `${TokenType.IDENTIFIER}(let)`,
            `${TokenType.IDENTIFIER}(x)`,
            `${TokenType.EQUALS}(=)`,
            `${TokenType.NUMBER}(42)`,
            `${TokenType.SEMICOLON}(;)`
        ]);
    });

    it('handles empty input', () => {
        const input = '';
        const tokens = lexer(input);
        expect(tokens.length).to.equal(1);
        expect(tokenToString(tokens[0])).to.equal(`${TokenType.EOF}()`);
    });

    it('handles single character tokens', () => {
        const input = '+-*/=;';
        expectTokens(input, [
            `${TokenType.PLUS}(+)`,
            `${TokenType.MINUS}(-)`,
            `${TokenType.ASTERISK}(*)`,
            `${TokenType.SLASH}(/)`,
            `${TokenType.EQUALS}(=)`,
            `${TokenType.SEMICOLON}(;)`
        ]);
    });

    it('handles parentheses and braces', () => {
        const input = '(x + y) * {z - 1};';
        expectTokens(input, [
            `${TokenType[TokenType.LEFT_PAREN]}(()`,
            `${TokenType[TokenType.IDENTIFIER]}(x)`,
            `${TokenType[TokenType.PLUS]}(+)`,
            `${TokenType[TokenType.IDENTIFIER]}(y)`,
            `${TokenType[TokenType.RIGHT_PAREN]}())`,
            `${TokenType[TokenType.ASTERISK]}(*)`,
            `${TokenType[TokenType.LEFT_BRACE]}({)`,
            `${TokenType[TokenType.IDENTIFIER]}(z)`,
            `${TokenType[TokenType.MINUS]}(-)`,
            `${TokenType[TokenType.NUMBER]}(1)`,
            `${TokenType[TokenType.RIGHT_BRACE]}(})`,
            `${TokenType[TokenType.SEMICOLON]}(;)`
        ]);
    });

    it('handles floating-point numbers', () => {
        const input = '3.14 + 2.5;';
        expectTokens(input, [
            `${TokenType.NUMBER}(3.14)`,
            `${TokenType.PLUS}(+)`,
            `${TokenType.NUMBER}(2.5)`,
            `${TokenType.SEMICOLON}(;)`
        ]);
    });

    it('handles multiple statements', () => {
        const input = 'let x = 5; let y = 10; x + y;';
        expectTokens(input, [
            `${TokenType.IDENTIFIER}(let)`,
            `${TokenType.IDENTIFIER}(x)`,
            `${TokenType.EQUALS}(=)`,
            `${TokenType.NUMBER}(5)`,
            `${TokenType.SEMICOLON}(;)`,
            `${TokenType.IDENTIFIER}(let)`,
            `${TokenType.IDENTIFIER}(y)`,
            `${TokenType.EQUALS}(=)`,
            `${TokenType.NUMBER}(10)`,
            `${TokenType.SEMICOLON}(;)`,
            `${TokenType.IDENTIFIER}(x)`,
            `${TokenType.PLUS}(+)`,
            `${TokenType.IDENTIFIER}(y)`,
            `${TokenType.SEMICOLON}(;)`
        ]);
    });
});