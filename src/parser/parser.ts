import { LexerError } from '../lexer/lexerError';
import { Token } from '../lexer/token';
import { TokenType } from '../lexer/tokenTypes';
import { lexer } from '../lexer/lexer';
import { Logger } from '../utils/logger';
import { ParseError } from './parseError';
import { ASTNode } from './astNode';
import { ExpressionParser } from './expressionParser';
import { StatementParser } from './statementParser';

export class Parser {
    private tokens: Token[];
    private current: number = 0;
    public expressionParser: ExpressionParser;
    public statementParser: StatementParser;
    private logger: Logger;

    constructor(input: string | Token[], logger?: Logger) {
        this.logger = logger || new Logger('Parser');
        this.logger.info('Initializing parser');
        if (typeof input === 'string') {
            try {
                this.logger.info('Tokenizing input string');
                this.tokens = lexer(input, this.logger);
            } catch (error) {
                if (error instanceof LexerError) {
                    this.logger.error(`Lexer error: ${error.message}`);
                    // Pass a valid Token instance to avoid undefined
                    const eofToken = new Token(TokenType.EOF, '', error.line, error.column);
                    throw new ParseError(`Lexer error: ${error.message}`, eofToken);
                }
                throw error;
            }
        } else {
            this.tokens = input;
        }
        this.expressionParser = new ExpressionParser(this);
        this.statementParser = new StatementParser(this);
        this.logger.info('Parser initialized');
    }

    parse(): ASTNode {
        const statements: ASTNode[] = [];
        while (!this.isAtEnd()) {
            statements.push(this.statementParser.parseStatement());
        }
        const program = new ASTNode('Program', statements);
        this.logger.debug('Parsing program');
        return program;
    }

    match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance();
        if (this.isAtEnd()) {
            throw this.error(this.previous(), message);
        }
        throw this.error(this.peek(), message);
    }
    
    check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    isAtEnd(): boolean {
        return this.peek().type === TokenType.EOF;
    }

    peek(): Token {
        return this.tokens[this.current];
    }

    previous(): Token {
        return this.tokens[this.current - 1];
    }

    error(token: Token, message: string): ParseError {
        this.logger.error(`Parse error at line ${token.line}, column ${token.column}: ${message}`);
        return new ParseError(message, token);
    }
}

export { ASTNode, ParseError };