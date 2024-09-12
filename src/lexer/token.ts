export class Token {
    constructor(
        public type: string,
        public value: string,
        public line: number,
        public column: number
    ) {}
}