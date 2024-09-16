import { Token } from '../lexer/token';

export class ParseError extends Error {
    constructor(message: string, public token: Token) {
        super(message);
        this.name = 'ParseError';
    }
}