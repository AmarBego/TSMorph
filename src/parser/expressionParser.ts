// src/parser/expressionParser.ts

import { TokenType } from '../lexer/tokenTypes';
import { ASTNode } from './astNode';
import { Parser } from './parser';
import { ParseError } from './parseError';

export class ExpressionParser {
    constructor(private parser: Parser) {}

    expression(): ASTNode {
        return this.assignment();
    }

    private assignment(): ASTNode {
        const expr = this.additive();

        if (this.parser.match(TokenType.EQUALS)) {
            const equals = this.parser.previous();
            const value = this.assignment();

            if (expr.type !== 'Identifier') {
                throw this.parser.error(equals, 'Invalid assignment target.');
            }

            return new ASTNode('Assignment', [expr, value]);
        }

        return expr;
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
            return new ASTNode('NumberLiteral', [], value);
        }

        if (this.parser.match(TokenType.STRING)) {
            const value = this.parser.previous().value;
            return new ASTNode('StringLiteral', [], value);
        }

        if (this.parser.match(TokenType.IDENTIFIER)) {
            const name = this.parser.previous().value;
            return new ASTNode('Identifier', [], name);
        }

        if (this.parser.match(TokenType.LEFT_PAREN)) {
            const expr = this.expression();
            this.parser.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression.");
            return new ASTNode('GroupingExpression', [expr]);
        }

        throw this.parser.error(this.parser.peek(), "Expected expression.");
    }
}