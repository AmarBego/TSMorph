export class CompilerTypeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CompilerTypeError';
    }
}