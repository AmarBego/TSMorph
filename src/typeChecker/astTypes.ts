import { ASTNode } from '../parser/astNode';

export type Type =
    | { kind: 'number' }
    | { kind: 'string' }
    | { kind: 'boolean' }
    | { kind: 'void' }
    | { kind: 'any' }
    | { kind: 'unknown' }
    | { kind: 'custom'; name: string }
    | { kind: 'function'; params: Type[]; returnType: Type }
    | { kind: 'generic'; name: string; constraint?: Type };

export class TypedASTNode extends ASTNode {
    inferredType?: Type;

    constructor(type: string, children: ASTNode[] = [], value?: string) {
        super(type, children, value);
    }
}