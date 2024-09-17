import { Parser, ASTNode, ParseError } from './parser/parser';
import { LexerError } from './lexer/lexerError';
import { TypeChecker } from './typeChecker/typeChecker';
import { CompilerTypeError } from './typeChecker/errors';

export function compile(input: string): ASTNode {
    try {
        const parser = new Parser(input);
        const ast = parser.parse();

        const typeChecker = new TypeChecker();
        typeChecker.check(ast);

        return ast;
    } catch (error) {
        if (error instanceof LexerError) {
            throw new Error(`Unexpected character: ${error.message} at line ${error.line}, column ${error.column}`);
        } else if (error instanceof ParseError) {
            throw new Error(`Parse error: ${error.message} at line ${error.token.line}, column ${error.token.column}`);
        } else if (error instanceof CompilerTypeError) {
            throw new Error(`Type error: ${error.message}`);
        } else {
            throw error;
        }
    }
}