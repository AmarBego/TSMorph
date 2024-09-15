import { LexerError } from './lexer/lexerError';
import { Token } from './lexer/token';
import { TokenType } from './lexer/tokenTypes';
import { lexer } from './lexer/lexer';

class ParseError extends Error {
    constructor(message: string, public token: Token) {
        super(message);
        this.name = 'ParseError';
    }
}

class ASTNode {
    constructor(public type: string, public children: ASTNode[] = []) {}
}

export class Parser {
    private tokens: Token[];
    private current: number = 0;

    constructor(input: string | Token[]) {
        if (typeof input === 'string') {
            try {
                this.tokens = lexer(input);
            } catch (error) {
                if (error instanceof LexerError) {
                    throw new ParseError(`Lexer error: ${error.message}`, new Token(TokenType.EOF, '', error.line, error.column));
                }
                throw error;
            }
        } else {
            this.tokens = input;
        }
    }

    parse(): ASTNode {
        try {
            return this.program();
        } catch (error) {
            if (error instanceof ParseError) {
                console.error(`Parse error at line ${error.token.line}, column ${error.token.column}: ${error.message}`);
            }
            throw error;
        }
    }

    private program(): ASTNode {
        const statements: ASTNode[] = [];
        while (!this.isAtEnd()) {
            statements.push(this.statement());
        }
        return new ASTNode('Program', statements);
    }

    private statement(): ASTNode {
        return this.expressionStatement();
    }

    private expressionStatement(): ASTNode {
        const expr = this.expression();
        this.consume(TokenType.SEMICOLON, "Expected ';' after expression.");
        return new ASTNode('ExpressionStatement', [expr]);
    }

    private expression(): ASTNode {
        return this.additive();
    }

    private additive(): ASTNode {
        let expr = this.multiplicative();

        while (this.match(TokenType.PLUS, TokenType.MINUS)) {
            const operator = this.previous();
            const right = this.multiplicative();
            expr = new ASTNode(operator.type === TokenType.PLUS ? 'Addition' : 'Subtraction', [expr, right]);
        }

        return expr;
    }

    private multiplicative(): ASTNode {
        let expr = this.primary();

        while (this.match(TokenType.ASTERISK, TokenType.SLASH)) {
            const operator = this.previous();
            const right = this.primary();
            expr = new ASTNode(operator.type === TokenType.ASTERISK ? 'Multiplication' : 'Division', [expr, right]);
        }

        return expr;
    }

    private primary(): ASTNode {
        if (this.match(TokenType.NUMBER)) {
            return new ASTNode('NumberLiteral', [new ASTNode(this.previous().value)]);
        }

        if (this.match(TokenType.IDENTIFIER)) {
            return new ASTNode('Identifier', [new ASTNode(this.previous().value)]);
        }

        if (this.match(TokenType.LEFT_PAREN)) {
            const expr = this.expression();
            this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression.");
            return new ASTNode('GroupingExpression', [expr]);
        }

        throw this.error(this.peek(), "Expected expression.");
    }

    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance();
        throw this.error(this.peek(), message);
    }

    private check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private isAtEnd(): boolean {
        return this.peek().type === TokenType.EOF;
    }

    private peek(): Token {
        return this.tokens[this.current];
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    private error(token: Token, message: string): ParseError {
        return new ParseError(message, token);
    }
}

export { ASTNode, ParseError };