import { ASTNode } from '../parser/astNode';
import { TypeEnvironment } from './typeEnvironment';
import { CompilerTypeError } from './errors';
import { Type } from './astTypes';

export class TypeChecker {
    private env = new TypeEnvironment();

    check(node: ASTNode): void {
        if (node.type === 'Program') {
            node.children.forEach(child => this.check(child));
        } else if (node.type === 'VariableDeclaration') {
            const identifier = node.children[0];
            const initializer = node.children[1];
            this.check(initializer);
            const varType = this.inferType(initializer);
            this.env.defineVariable(identifier.value!, varType);
        } else if (node.type === 'ExpressionStatement') {
            // Handle the expression within the ExpressionStatement
            this.check(node.children[0]);
        } else if (node.type === 'Assignment') {
            const identifier = node.children[0];
            const value = node.children[1];
            if (!this.env.hasVariable(identifier.value!)) {
                throw new CompilerTypeError(`Undefined variable ${identifier.value}`);
            }
            this.check(value);
            const varType = this.env.getVariable(identifier.value!);
            const valueType = this.inferType(value);
            if (varType && varType.kind !== valueType.kind) {
                throw new CompilerTypeError(`Type mismatch: Cannot assign ${valueType.kind} to ${varType.kind}`);
            }
        } else if (
            node.type === 'Addition' ||
            node.type === 'Subtraction' ||
            node.type === 'Multiplication' ||
            node.type === 'Division'
        ) {
            node.children.forEach(child => this.check(child));
            const leftType = this.inferType(node.children[0]);
            const rightType = this.inferType(node.children[1]);
            if (leftType.kind !== 'number' || rightType.kind !== 'number') {
                throw new CompilerTypeError('Operands must be numbers');
            }
        }
        // Handle other node types...
    }

    private inferType(node: ASTNode): Type {
        if (node.type === 'NumberLiteral') {
            return { kind: 'number' };
        } else if (node.type === 'StringLiteral') {
            return { kind: 'string' };
        } else if (node.type === 'Identifier') {
            const varType = this.env.getVariable(node.value!);
            if (!varType) {
                throw new CompilerTypeError(`Undefined variable ${node.value}`);
            }
            return varType;
        }
        // Handle other node types...
        return { kind: 'unknown' };
    }
}