import { expect } from 'chai';
import { lexer } from '../../src/lexer/lexer';
import { TokenType } from '../../src/lexer/tokenTypes';
import { LexerError } from '../../src/lexer/lexerError';
import { Logger } from '../../src/utils/logger';
import sinon from 'sinon';

describe('Lexer', () => {

    it('logs tokenization process with mockLogger', () => {
        const input = 'let x = 42;';
        const mockLogger = new Logger('Lexer');
        const infoSpy = sinon.spy(mockLogger, 'info');
        const debugSpy = sinon.spy(mockLogger, 'debug');
    
        lexer(input, mockLogger);
    
        expect(infoSpy.calledWith('Starting tokenization process')).to.be.true;
        expect(debugSpy.calledWith(`Token added: ${TokenType.LET} (let)`)).to.be.true;
        expect(debugSpy.calledWith(`Token added: ${TokenType.IDENTIFIER} (x)`)).to.be.true;
        expect(debugSpy.calledWith(`Token added: ${TokenType.EQUALS} (=)`)).to.be.true;
        expect(debugSpy.calledWith(`Token added: ${TokenType.NUMBER} (42)`)).to.be.true;
        expect(debugSpy.calledWith(`Token added: ${TokenType.SEMICOLON} (;)`)).to.be.true;
        expect(infoSpy.calledWith('Tokenization completed')).to.be.true;
    
        infoSpy.restore();
        debugSpy.restore();
    });
    
    function expectTokens(input: string, expectedTokens: { type: TokenType, value: string }[]) {
        const tokens = lexer(input);
        expect(tokens.length).to.equal(expectedTokens.length + 1); // +1 for EOF
        for (let i = 0; i < expectedTokens.length; i++) {
            expect(tokens[i].type).to.equal(expectedTokens[i].type);
            expect(tokens[i].value).to.equal(expectedTokens[i].value);
        }
        expect(tokens[tokens.length - 1].type).to.equal(TokenType.EOF);
        expect(tokens[tokens.length - 1].value).to.equal('');
    }

    it('logs tokenization process with console.log', () => {
        const input = 'let x = 42;';
        const logSpy = sinon.spy(console, 'log');
        
        lexer(input);
    
        expect(logSpy.calledWith('[Lexer] INFO: Starting tokenization process')).to.be.true;
        expect(logSpy.calledWith('[Lexer] INFO: Tokenization completed')).to.be.true;
        expect(logSpy.calledWith(sinon.match(/\[Lexer\] DEBUG: Token added: .+/))).to.be.true;
    
        logSpy.restore();
    });

    it('tokenizes identifiers and numbers', () => {
        const input = 'let x = 42;';
        expectTokens(input, [
            { type: TokenType.LET, value: 'let' },
            { type: TokenType.IDENTIFIER, value: 'x' },
            { type: TokenType.EQUALS, value: '=' },
            { type: TokenType.NUMBER, value: '42' },
            { type: TokenType.SEMICOLON, value: ';' }
        ]);
    });

    it('tokenizes operators', () => {
        const input = 'x + y - z * 2 / 1;';
        expectTokens(input, [
            { type: TokenType.IDENTIFIER, value: 'x' },
            { type: TokenType.PLUS, value: '+' },
            { type: TokenType.IDENTIFIER, value: 'y' },
            { type: TokenType.MINUS, value: '-' },
            { type: TokenType.IDENTIFIER, value: 'z' },
            { type: TokenType.ASTERISK, value: '*' },
            { type: TokenType.NUMBER, value: '2' },
            { type: TokenType.SLASH, value: '/' },
            { type: TokenType.NUMBER, value: '1' },
            { type: TokenType.SEMICOLON, value: ';' }
        ]);
    });

    it('tokenizes multi-character operators', () => {
        const input = 'x == y != z <= 2 >= 1;';
        expectTokens(input, [
            { type: TokenType.IDENTIFIER, value: 'x' },
            { type: TokenType.EQUALS_EQUALS, value: '==' },
            { type: TokenType.IDENTIFIER, value: 'y' },
            { type: TokenType.NOT_EQUALS, value: '!=' },
            { type: TokenType.IDENTIFIER, value: 'z' },
            { type: TokenType.LESS_EQUALS, value: '<=' },
            { type: TokenType.NUMBER, value: '2' },
            { type: TokenType.GREATER_EQUALS, value: '>=' },
            { type: TokenType.NUMBER, value: '1' },
            { type: TokenType.SEMICOLON, value: ';' }
        ]);
    });

    it('tokenizes string literals', () => {
        const input = 'let str = "hello \\"world\\"";';
        expectTokens(input, [
            { type: TokenType.LET, value: 'let' },
            { type: TokenType.IDENTIFIER, value: 'str' },
            { type: TokenType.EQUALS, value: '=' },
            { type: TokenType.STRING, value: '"hello \\"world\\""' },
            { type: TokenType.SEMICOLON, value: ';' }
        ]);
    });

    it('handles comments', () => {
        const input = 'let x = 42; // this is a comment\n/* multi-line\ncomment */';
        expectTokens(input, [
            { type: TokenType.LET, value: 'let' },
            { type: TokenType.IDENTIFIER, value: 'x' },
            { type: TokenType.EQUALS, value: '=' },
            { type: TokenType.NUMBER, value: '42' },
            { type: TokenType.SEMICOLON, value: ';' }
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
            { type: TokenType.LET, value: 'let' },
            { type: TokenType.IDENTIFIER, value: 'x' },
            { type: TokenType.EQUALS, value: '=' },
            { type: TokenType.NUMBER, value: '42' },
            { type: TokenType.SEMICOLON, value: ';' }
        ]);
    });

    it('handles empty input', () => {
        const input = '';
        const tokens = lexer(input);
        expect(tokens.length).to.equal(1);
        expect(tokens[0].type).to.equal(TokenType.EOF);
        expect(tokens[0].value).to.equal('');
    });

    it('handles single character tokens', () => {
        const input = '+-*/=;';
        expectTokens(input, [
            { type: TokenType.PLUS, value: '+' },
            { type: TokenType.MINUS, value: '-' },
            { type: TokenType.ASTERISK, value: '*' },
            { type: TokenType.SLASH, value: '/' },
            { type: TokenType.EQUALS, value: '=' },
            { type: TokenType.SEMICOLON, value: ';' }
        ]);
    });

    it('handles parentheses and braces', () => {
        const input = '(x + y) * {z - 1};';
        expectTokens(input, [
            { type: TokenType.LEFT_PAREN, value: '(' },
            { type: TokenType.IDENTIFIER, value: 'x' },
            { type: TokenType.PLUS, value: '+' },
            { type: TokenType.IDENTIFIER, value: 'y' },
            { type: TokenType.RIGHT_PAREN, value: ')' },
            { type: TokenType.ASTERISK, value: '*' },
            { type: TokenType.LEFT_BRACE, value: '{' },
            { type: TokenType.IDENTIFIER, value: 'z' },
            { type: TokenType.MINUS, value: '-' },
            { type: TokenType.NUMBER, value: '1' },
            { type: TokenType.RIGHT_BRACE, value: '}' },
            { type: TokenType.SEMICOLON, value: ';' }
        ]);
    });

    it('handles floating-point numbers', () => {
        const input = '3.14 + 2.5;';
        expectTokens(input, [
            { type: TokenType.NUMBER, value: '3.14' },
            { type: TokenType.PLUS, value: '+' },
            { type: TokenType.NUMBER, value: '2.5' },
            { type: TokenType.SEMICOLON, value: ';' }
        ]);
    });

    it('handles multiple statements', () => {
        const input = 'let x = 5; let y = 10; x + y;';
        expectTokens(input, [
            { type: TokenType.LET, value: 'let' },
            { type: TokenType.IDENTIFIER, value: 'x' },
            { type: TokenType.EQUALS, value: '=' },
            { type: TokenType.NUMBER, value: '5' },
            { type: TokenType.SEMICOLON, value: ';' },
            { type: TokenType.LET, value: 'let' },
            { type: TokenType.IDENTIFIER, value: 'y' },
            { type: TokenType.EQUALS, value: '=' },
            { type: TokenType.NUMBER, value: '10' },
            { type: TokenType.SEMICOLON, value: ';' },
            { type: TokenType.IDENTIFIER, value: 'x' },
            { type: TokenType.PLUS, value: '+' },
            { type: TokenType.IDENTIFIER, value: 'y' },
            { type: TokenType.SEMICOLON, value: ';' }
        ]);
    });

});