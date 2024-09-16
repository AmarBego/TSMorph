export class ASTNode {
    constructor(
        public type: string,
        public children: ASTNode[] = []
    ) {}
}