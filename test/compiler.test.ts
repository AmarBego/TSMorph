import { expect } from 'chai';
import { compile } from '../src/compiler';
import { ASTNode } from '../src/parser';

describe('Compiler', () => {
    it('compiles simple arithmetic expressions', () => {
        const input = '2 + 3 * 4;';
        const ast = compile(input);

        expect(ast).to.deep.equal(
            new ASTNode('Program', [
                new ASTNode('ExpressionStatement', [
                    new ASTNode('Addition', [
                        new ASTNode('NumberLiteral', [new ASTNode('2')]),
                        new ASTNode('Multiplication', [
                            new ASTNode('NumberLiteral', [new ASTNode('3')]),
                            new ASTNode('NumberLiteral', [new ASTNode('4')])
                        ])
                    ])
                ])
            ])
        );
    });

    it('handles lexer and parser errors', () => {
        expect(() => compile('2 + @ * 4;')).to.throw('Unexpected character: @');
        expect(() => compile('2 +')).to.throw("Expected expression.");
    });
});