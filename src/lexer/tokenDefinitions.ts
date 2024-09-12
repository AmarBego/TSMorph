import { TokenType } from './tokenTypes';

export interface TokenDefinition {
    type: TokenType;
    regex: RegExp;
    ignore?: boolean;
}

export const tokenDefinitions: TokenDefinition[] = [
    { type: TokenType.WHITESPACE, regex: /^\s+/, ignore: true },
    { type: TokenType.COMMENT, regex: /^\/\/.*/, ignore: true },
    { type: TokenType.MULTILINE_COMMENT, regex: /^\/\*[\s\S]*?\*\//, ignore: true },
    { type: TokenType.NUMBER, regex: /^\d+(\.\d+)?/ },
    { type: TokenType.STRING, regex: /^"([^"\\]|\\.)*"/ },
    { type: TokenType.IDENTIFIER, regex: /^[a-zA-Z_]\w*/ },
    { type: TokenType.EQUALS_EQUALS, regex: /^==/ },
    { type: TokenType.NOT_EQUALS, regex: /^!=/ },
    { type: TokenType.LESS_EQUALS, regex: /^<=/ },
    { type: TokenType.GREATER_EQUALS, regex: /^>=/ },
    { type: TokenType.EQUALS, regex: /^=/ },
    { type: TokenType.PLUS, regex: /^\+/ },
    { type: TokenType.MINUS, regex: /^-/ },
    { type: TokenType.ASTERISK, regex: /^\*/ },
    { type: TokenType.SLASH, regex: /^\// },
    { type: TokenType.LEFT_PAREN, regex: /^\(/ },
    { type: TokenType.RIGHT_PAREN, regex: /^\)/ },
    { type: TokenType.LEFT_BRACE, regex: /^\{/ },
    { type: TokenType.RIGHT_BRACE, regex: /^\}/ },
    { type: TokenType.SEMICOLON, regex: /^;/ },
    { type: TokenType.COMMA, regex: /^,/ },
];