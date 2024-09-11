class Token {
    constructor(
        public type: string,
        public value: string,
        public line: number,
        public column: number
    ) {}
}

const tokenTypes = [
    { regex: /\s+/, type: 'WHITESPACE' },
    { regex: /\/\/.*(?:\r?\n|$)/, type: 'COMMENT' }, // Single-line comments
    { regex: /\/\*[\s\S]*?\*\//, type: 'COMMENT' }, // Multi-line comments
    { regex: /==/, type: 'EQUALS_EQUALS' },
    { regex: /!=/, type: 'NOT_EQUALS' },
    { regex: /<=/, type: 'LESS_EQUALS' },
    { regex: />=/, type: 'GREATER_EQUALS' },
    { regex: /[a-zA-Z_]\w*/, type: 'IDENTIFIER' },
    { regex: /\d+/, type: 'NUMBER' },
    { regex: /;/, type: 'SEMICOLON' },
    { regex: /=/, type: 'EQUALS' },
    { regex: /\+/, type: 'PLUS' },
    { regex: /-/, type: 'MINUS' },
    { regex: /\*/, type: 'ASTERISK' },
    { regex: /\//, type: 'SLASH' },
    { regex: /"([^"\\]|\\.)*"/, type: 'STRING' }, // String literals
];

function log(message: string): void {
    console.log(`[Lexer]: ${message}`);
}

class LexerError extends Error {
    constructor(message: string, public line: number, public column: number) {
        super(message);
        this.name = 'LexerError';
    }
}

function lexer(input: string): Token[] {
    const tokens: Token[] = [];
    let pos = 0;
    let line = 1;
    let column = 1;

    function updatePosition(str: string) {
        for (const char of str) {
            if (char === '\n') {
                line++;
                column = 1;
            } else {
                column++;
            }
        }
    }

    log(`Starting lexical analysis of input (length: ${input.length})`);

    while (pos < input.length) {
        let match = false;
        for (const { regex, type } of tokenTypes) {
            const result = regex.exec(input.slice(pos));
            if (result && result.index === 0) {
                if (type === 'COMMENT' || type === 'WHITESPACE') {
                    log(`Skipped ${type} at line ${line}, column ${column}: "${result[0].replace(/\n/g, '\\n')}"`);
                } else {
                    tokens.push(new Token(type, result[0], line, column));
                    log(`Tokenized: ${type}(${result[0]}) at line ${line}, column ${column}`);
                }
                updatePosition(result[0]);
                pos += result[0].length;
                match = true;
                break;
            }
        }
        if (!match) {
            const errorContext = input.slice(pos, pos + 10);
            const errorMessage = `Unexpected token at line ${line}, column ${column}, near '${errorContext}'`;
            log(`Error: ${errorMessage}`);
            
            // Token recovery: skip the problematic character and continue
            log(`Attempting recovery: Skipping character '${input[pos]}' at position ${pos}`);
            updatePosition(input[pos]);
            pos++;
            
            // Throw an error, but continue processing
            throw new LexerError(errorMessage, line, column);
        }
    }

    log(`Lexical analysis completed. Total tokens: ${tokens.length}`);
    return tokens;
}

export { Token, lexer, LexerError };