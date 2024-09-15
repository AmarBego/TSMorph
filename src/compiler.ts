import { Parser, ASTNode } from './parser';
import { lexer } from './lexer/lexer';
import { LexerError } from './lexer/lexerError';

export function compile(input: string): ASTNode {
    try {
        const tokens = lexer(input);
        const parser = new Parser(tokens);
        return parser.parse();
    } catch (error) {
        if (error instanceof LexerError) {
            console.error(`Lexer error: ${error.message}`);
        }
        throw error;
    }
}