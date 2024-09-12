import { Token, LexerError } from './lexer';

class ParseError extends Error {
    constructor(message: string, public token: Token) {
        super(message);
        this.name = 'ParseError';
    }
}

class ASTNode {
    constructor(public type: string, public children: ASTNode[] = []) {}
}

class Parser {
    private tokens: Token[];
    private current: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
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
        // Implement various statement types here
        // For now, let's just handle expression statements
        return this.expressionStatement();
    }

    private expressionStatement(): ASTNode {
        const expr = this.expression();
        this.consume('SEMICOLON', "Expected ';' after expression.");
        return new ASTNode('ExpressionStatement', [expr]);
    }

    private expression(): ASTNode {
        // Implement expression parsing here
        // For now, let's just handle simple arithmetic
        return this.additive();
    }

    private additive(): ASTNode {
        let expr = this.multiplicative();

        while (this.match('PLUS', 'MINUS')) {
            const operator = this.previous();
            const right = this.multiplicative();
            expr = new ASTNode(operator.type === 'PLUS' ? 'Addition' : 'Subtraction', [expr, right]);
        }

        return expr;
    }

    private multiplicative(): ASTNode {
        let expr = this.primary();

        while (this.match('ASTERISK', 'SLASH')) {
            const operator = this.previous();
            const right = this.primary();
            expr = new ASTNode(operator.type === 'ASTERISK' ? 'Multiplication' : 'Division', [expr, right]);
        }

        return expr;
    }

    private primary(): ASTNode {
        if (this.match('NUMBER')) {
            return new ASTNode('NumberLiteral', [new ASTNode(this.previous().value)]);
        }

        if (this.match('IDENTIFIER')) {
            return new ASTNode('Identifier', [new ASTNode(this.previous().value)]);
        }

        if (this.match('LEFT_PAREN')) {
            const expr = this.expression();
            this.consume('RIGHT_PAREN', "Expected ')' after expression.");
            return new ASTNode('GroupingExpression', [expr]);
        }

        throw this.error(this.peek(), "Expected expression.");
    }

    private match(...types: string[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    private consume(type: string, message: string): Token {
        if (this.check(type)) return this.advance();
        throw this.error(this.peek(), message);
    }

    private check(type: string): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private isAtEnd(): boolean {
        return this.peek().type === 'EOF';
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

export { Parser, ASTNode, ParseError };