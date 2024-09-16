import { TokenType } from './tokenTypes';

export class Token {
    constructor(
        public type: TokenType,
        public value: string,
        public line: number,
        public column: number
    ) {}
}