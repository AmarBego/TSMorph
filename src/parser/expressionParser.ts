import { ASTNode } from './astNode';
import { TokenType } from '../lexer/tokenTypes';
import { Parser } from './parser';

export class ExpressionParser {
    constructor(private parser: Parser) {}

    expression(): ASTNode {
        return this.additive();
    }

    private additive(): ASTNode {
        let expr = this.multiplicative();

        while (this.parser.match(TokenType.PLUS, TokenType.MINUS)) {
            const operator = this.parser.previous();
            const right = this.multiplicative();
            const type = operator.type === TokenType.PLUS ? 'Addition' : 'Subtraction';
            expr = new ASTNode(type, [expr, right]);
        }

        return expr;
    }

    private multiplicative(): ASTNode {
        let expr = this.primary();

        while (this.parser.match(TokenType.ASTERISK, TokenType.SLASH)) {
            const operator = this.parser.previous();
            const right = this.primary();
            const type = operator.type === TokenType.ASTERISK ? 'Multiplication' : 'Division';
            expr = new ASTNode(type, [expr, right]);
        }

        return expr;
    }

    private primary(): ASTNode {
        if (this.parser.match(TokenType.NUMBER)) {
            const value = this.parser.previous().value;
            return new ASTNode('NumberLiteral', [new ASTNode(value)]);
        }
    
        if (this.parser.match(TokenType.IDENTIFIER)) {
            const name = this.parser.previous().value;
            return new ASTNode('Identifier', [new ASTNode(name)]);
        }
    
        if (this.parser.match(TokenType.LEFT_PAREN)) {
            const expr = this.expression();
            this.parser.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression.");
            return new ASTNode('GroupingExpression', [expr]);
        }
    
        throw this.parser.error(this.parser.peek(), "Expected expression.");
    }
}