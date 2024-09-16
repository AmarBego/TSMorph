import { Parser, ASTNode, ParseError } from './parser/parser';
import { LexerError } from './lexer/lexerError';

export function compile(input: string): ASTNode {
    try {
        const parser = new Parser(input);
        return parser.parse();
    } catch (error) {
        if (error instanceof LexerError) {
            throw new Error(`Unexpected character: ${error.message}`);
        } else if (error instanceof ParseError) {
            throw new Error(`Parse error: ${error.message}`);
        } else {
            throw error;
        }
    }
}