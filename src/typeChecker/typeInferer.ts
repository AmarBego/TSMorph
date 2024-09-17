import { TypedASTNode, Type } from './astTypes';
import { TypeEnvironment } from './typeEnvironment';
import { CompilerTypeError } from './errors';

export class TypeInferer {
    constructor(private env: TypeEnvironment) {}

    infer(node: TypedASTNode): Type {
        switch (node.type) {
            case 'Program':
                node.children.forEach(child => this.infer(child as TypedASTNode));
                node.inferredType = { kind: 'void' };
                return node.inferredType;

            case 'NumberLiteral':
                node.inferredType = { kind: 'number' };
                return node.inferredType;

            case 'StringLiteral':
                node.inferredType = { kind: 'string' };
                return node.inferredType;

            case 'BooleanLiteral':
                node.inferredType = { kind: 'boolean' };
                return node.inferredType;

            case 'Identifier':
                const varName = node.value;
                if (!varName) {
                    throw new CompilerTypeError(`Identifier node missing value.`);
                }
                const varType = this.env.getVariable(varName);
                if (!varType) {
                    throw new CompilerTypeError(`Undefined variable ${varName}`);
                }
                node.inferredType = varType;
                return varType;

            case 'Addition':
            case 'Subtraction':
            case 'Multiplication':
            case 'Division':
                const leftType = this.infer(node.children[0] as TypedASTNode);
                const rightType = this.infer(node.children[1] as TypedASTNode);
                if (leftType.kind !== 'number' || rightType.kind !== 'number') {
                    throw new CompilerTypeError(`Operands must be numbers`);
                }
                node.inferredType = { kind: 'number' };
                return node.inferredType;

            case 'VariableDeclaration':
                const identifierNode = node.children[0] as TypedASTNode;
                const varDeclName = identifierNode.value;
                if (!varDeclName) {
                    throw new CompilerTypeError(`VariableDeclaration missing identifier name.`);
                }
                const initializerType = this.infer(node.children[1] as TypedASTNode);
                this.env.defineVariable(varDeclName, initializerType);
                node.inferredType = { kind: 'void' };
                return node.inferredType;

            case 'ExpressionStatement':
                const exprType = this.infer(node.children[0] as TypedASTNode);
                node.inferredType = exprType;
                return exprType;

            // Add more cases as needed for other node types

            default:
                throw new CompilerTypeError(`Unknown AST node type: ${node.type}`);
        }
    }
}