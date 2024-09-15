import { Token } from './token';
import { LexerError } from './lexerError';
import { TokenDefinition, tokenDefinitions } from './tokenDefinitions';
import { TokenType } from './tokenTypes';
import { Logger } from '../utils/logger';

export class Lexer {
    private tokens: Token[] = [];
    private current: number = 0;
    private line: number = 1;
    private column: number = 1;
    private logger: Logger;

    constructor(private input: string, private tokenDefinitions: TokenDefinition[]) {
        this.logger = new Logger('Lexer');
    }

    tokenize(): Token[] {
        this.logger.info('Starting tokenization process');
        while (this.current < this.input.length) {
            if (!this.scanToken()) {
                this.throwError(`Unexpected character: ${this.getCurrentChar()}`);
            }
        }
        this.addToken(TokenType.EOF, '');
        this.logger.info('Tokenization completed');
        return this.tokens;
    }

    private scanToken(): boolean {
        for (const { type, regex, ignore } of this.tokenDefinitions) {
            const match = this.input.slice(this.current).match(regex);
            if (match && match.index === 0) {
                const value = match[0];
                if (!ignore) {
                    this.addToken(type, value);
                    this.logger.debug(`Token added: ${type} (${value})`);
                }
                this.updatePosition(value);
                this.current += value.length;
                return true;
            }
        }
        return false;
    }

    private addToken(type: TokenType, value: string): void {
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

    private getCurrentChar(): string {
        return this.input[this.current];
    }

    private throwError(message: string): never {
        throw new LexerError(message, this.line, this.column);
    }
}

export function lexer(input: string): Token[] {
    const lex = new Lexer(input, tokenDefinitions);
    return lex.tokenize();
}