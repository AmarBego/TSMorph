export class Token {
    constructor(
        public type: string,
        public value: string,
        public line: number,
        public column: number
    ) {}
}

export class LexerError extends Error {
    constructor(message: string, public line: number, public column: number) {
        super(message);
        this.name = 'LexerError';
    }
}

interface TokenDefinition {
    type: string;
    regex: RegExp;
    ignore?: boolean;
}

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
        this.column += value.length;
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

const tokenDefinitions: TokenDefinition[] = [
    { type: 'WHITESPACE', regex: /^\s+/, ignore: true },
    { type: 'COMMENT', regex: /^\/\/.*/, ignore: true },
    { type: 'MULTILINE_COMMENT', regex: /^\/\*[\s\S]*?\*\//, ignore: true },
    { type: 'NUMBER', regex: /^\d+(\.\d+)?/ },
    { type: 'STRING', regex: /^"([^"\\]|\\.)*"/ },
    { type: 'IDENTIFIER', regex: /^[a-zA-Z_]\w*/ },
    { type: 'EQUALS_EQUALS', regex: /^==/ },
    { type: 'NOT_EQUALS', regex: /^!=/ },
    { type: 'LESS_EQUALS', regex: /^<=/ },
    { type: 'GREATER_EQUALS', regex: /^>=/ },
    { type: 'EQUALS', regex: /^=/ },
    { type: 'PLUS', regex: /^\+/ },
    { type: 'MINUS', regex: /^-/ },
    { type: 'ASTERISK', regex: /^\*/ },
    { type: 'SLASH', regex: /^\// },
    { type: 'LEFT_PAREN', regex: /^\(/ },
    { type: 'RIGHT_PAREN', regex: /^\)/ },
    { type: 'LEFT_BRACE', regex: /^\{/ },
    { type: 'RIGHT_BRACE', regex: /^\}/ },
    { type: 'SEMICOLON', regex: /^;/ },
    { type: 'COMMA', regex: /^,/ },
];

export function lexer(input: string): Token[] {
    const lex = new Lexer(input, tokenDefinitions);
    return lex.tokenize();
}