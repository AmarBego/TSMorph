import { Token } from './token';
import { LexerError } from './lexerError';
import { TokenDefinition, tokenDefinitions } from './tokenDefinitions';

export class Lexer {
    private tokens: Token[] = [];
    private current: number = 0;
    private line: number = 1;
    private column: number = 1;

    constructor(private input: string, private tokenDefinitions: TokenDefinition[]) {}

    tokenize(): Token[] {
        while (this.current < this.input.length) {
            let matched = false;
            for (const { type, regex, ignore } of this.tokenDefinitions) {
                const match = this.input.slice(this.current).match(regex);
                if (match && match.index === 0) {
                    const value = match[0];
                    if (!ignore) {
                        this.addToken(type, value);
                    }
                    this.updatePosition(value);
                    this.current += value.length;
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                throw new LexerError(
                    `Unexpected character: ${this.input[this.current]}`,
                    this.line,
                    this.column
                );
            }
        }
        this.addToken('EOF', '');
        return this.tokens;
    }

    private addToken(type: string, value: string): void {
        this.tokens.push(new Token(type, value, this.line, this.column));
    }
    

    private updatePosition(str: string): void {
        for (const char of str) {
            if (char === '\n') {
                this.line++;
                this.column = 1;
            } else {
                this.column++;
            }
        }
    }
}

export function lexer(input: string): Token[] {
    const lex = new Lexer(input, tokenDefinitions);
    return lex.tokenize();
}