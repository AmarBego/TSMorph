import { TokenType } from './tokenTypes';

export interface TokenDefinition {
    type: TokenType;
    regex: RegExp;
    ignore?: boolean;
}

export const tokenDefinitions: TokenDefinition[] = [
    { type: TokenType.WHITESPACE, regex: /^\s+/, ignore: true },
    { type: TokenType.MULTI_LINE_COMMENT, regex: /^\/\*[\s\S]*?\*\//, ignore: true },
    { type: TokenType.COMMENT, regex: /^\/\/.*/, ignore: true },
    // Keywords
    { type: TokenType.LET, regex: /^let\b/ },
    { type: TokenType.IF, regex: /^if\b/ },
    { type: TokenType.ELSE, regex: /^else\b/ },
    { type: TokenType.WHILE, regex: /^while\b/ },
    { type: TokenType.FOR, regex: /^for\b/ },
    { type: TokenType.RETURN, regex: /^return\b/ },
    // Multi-character operators
    { type: TokenType.EQUALS_EQUALS, regex: /^==/ },
    { type: TokenType.NOT_EQUALS, regex: /^!=/ },
    { type: TokenType.LESS_EQUALS, regex: /^<=/ },
    { type: TokenType.GREATER_EQUALS, regex: /^>=/ },
    // Single-character operators and symbols
    { type: TokenType.PLUS, regex: /^\+/ },
    { type: TokenType.MINUS, regex: /^-/ },
    { type: TokenType.ASTERISK, regex: /^\*/ },
    { type: TokenType.SLASH, regex: /^\// },
    { type: TokenType.EQUALS, regex: /^=/ },
    { type: TokenType.LEFT_PAREN, regex: /^\(/ },
    { type: TokenType.RIGHT_PAREN, regex: /^\)/ },
    { type: TokenType.LEFT_BRACE, regex: /^\{/ },
    { type: TokenType.RIGHT_BRACE, regex: /^\}/ },
    { type: TokenType.SEMICOLON, regex: /^;/ },
    { type: TokenType.COMMA, regex: /^,/ },
    // Identifiers and literals
    { type: TokenType.IDENTIFIER, regex: /^[a-zA-Z_]\w*/ },
    { type: TokenType.NUMBER, regex: /^\d+(\.\d+)?/ },
    { type: TokenType.STRING, regex: /^"([^"\\]|\\.)*"/ },
    // EOF
    { type: TokenType.EOF, regex: /^$/ }
];