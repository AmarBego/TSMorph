import { expect } from 'chai';
import { lexer } from '../../src/lexer/lexer';
import { Parser, ASTNode, ParseError } from '../../src/parser';

describe('Parser', () => {
    it('parses simple arithmetic expressions', () => {
        const input = '2 + 3 * 4;';
        const tokens = lexer(input);
        const parser = new Parser(tokens);
        const ast = parser.parse();

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

    it('handles nested expressions', () => {
        const input = '(1 + 2) * (3 - 4);';
        const tokens = lexer(input);
        const parser = new Parser(tokens);
        const ast = parser.parse();

        expect(ast).to.deep.equal(
            new ASTNode('Program', [
                new ASTNode('ExpressionStatement', [
                    new ASTNode('Multiplication', [
                        new ASTNode('GroupingExpression', [
                            new ASTNode('Addition', [
                                new ASTNode('NumberLiteral', [new ASTNode('1')]),
                                new ASTNode('NumberLiteral', [new ASTNode('2')])
                            ])
                        ]),
                        new ASTNode('GroupingExpression', [
                            new ASTNode('Subtraction', [
                                new ASTNode('NumberLiteral', [new ASTNode('3')]),
                                new ASTNode('NumberLiteral', [new ASTNode('4')])
                            ])
                        ])
                    ])
                ])
            ])
        );
    });

    it('throws error on invalid syntax', () => {
        const input = '2 + * 3;';
        const tokens = lexer(input);
        const parser = new Parser(tokens);
        expect(() => parser.parse()).to.throw(ParseError, 'Expected expression.');
    });
});