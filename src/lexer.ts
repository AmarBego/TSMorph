class Token {
    constructor(public type: string, public value: string) {}
}

const tokenTypes = [
    { regex: /\s+/, type: 'WHITESPACE' },
    { regex: /[a-zA-Z_]\w*/, type: 'IDENTIFIER' },
    { regex: /\d+/, type: 'NUMBER' },
    { regex: /;/, type: 'SEMICOLON' },
    { regex: /=/, type: 'EQUALS' },
    { regex: /\+/, type: 'PLUS' },
    { regex: /-/, type: 'MINUS' },
    { regex: /\*/, type: 'ASTERISK' },
    { regex: /\//, type: 'SLASH' },
];

function log(message: string): void {
    console.log(`[Lexer]: ${message}`);
}

function lexer(input: string): Token[] {
    const tokens: Token[] = [];
    let pos = 0;

    while (pos < input.length) {
        let match = false;
        for (const { regex, type } of tokenTypes) {
            const result = regex.exec(input.slice(pos));
            if (result && result.index === 0) {
                if (type !== 'WHITESPACE') {
                    tokens.push(new Token(type, result[0]));
                    log(`Tokenized: ${type}(${result[0]}) at position ${pos}`);
                }
                pos += result[0].length;
                match = true;
                break;
            }
        }
        if (!match) {
            const errorContext = input.slice(pos, pos + 10);
            log(`Error: Unexpected token at position ${pos}, near '${errorContext}'`);
            throw new Error(`Unexpected token at position ${pos}`);
        }
    }
    return tokens;
}

export { Token, lexer };