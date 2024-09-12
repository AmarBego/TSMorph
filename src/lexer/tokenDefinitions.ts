export interface TokenDefinition {
    type: string;
    regex: RegExp;
    ignore?: boolean;
}

export const tokenDefinitions: TokenDefinition[] = [
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