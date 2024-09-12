export class LexerError extends Error {
    constructor(message: string, public line: number, public column: number) {
        super(message);
        this.name = 'LexerError';
    }
}