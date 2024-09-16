import { ASTNode } from './astNode';
import { Parser } from './parser';
import { TokenType } from '../lexer/tokenTypes';

export class StatementParser {
    constructor(private parser: Parser) {}

    parseStatement(): ASTNode {
        if (this.parser.match(TokenType.LET)) {
            return this.variableDeclaration();
        }

        return this.expressionStatement();
    }

    private variableDeclaration(): ASTNode {
        const nameToken = this.parser.consume(TokenType.IDENTIFIER, "Expected variable name.");
        const identifier = new ASTNode('Identifier', [new ASTNode(nameToken.value)]);
    
        this.parser.consume(TokenType.EQUALS, "Expected '=' after variable name.");
        const initializer = this.parser.expressionParser.expression();
    
        this.parser.consume(TokenType.SEMICOLON, "Expected ';' after variable declaration.");
        return new ASTNode('VariableDeclaration', [identifier, initializer]);
    }
    
    private expressionStatement(): ASTNode {
        const expr = this.parser.expressionParser.expression();
        this.parser.consume(TokenType.SEMICOLON, "Expected ';' after expression.");
        return new ASTNode('ExpressionStatement', [expr]);
    }
}