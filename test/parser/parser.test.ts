import { expect } from 'chai';
import { Parser, ASTNode, ParseError } from '../../src/parser/parser';
import sinon from 'sinon';
import { Logger } from '../../src/utils/logger';

describe('Parser', () => {
    it('logs parsing process', () => {
        const input = '2 + 3 * 4;';
        const mockLogger = new Logger('Parser');
        const logSpy = sinon.spy(mockLogger, 'info');

        const parser = new Parser(input, mockLogger);
        parser.parse();

        expect(logSpy.calledWith('Initializing parser')).to.be.true;
        expect(logSpy.calledWith('Tokenizing input string')).to.be.true;
        expect(logSpy.calledWith('Parser initialized')).to.be.true;

        logSpy.restore();
    });

    it('parses simple arithmetic expressions', () => {
        const input = '2 + 3 * 4;';
        const parser = new Parser(input);
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

    it('handles multiple statements', () => {
        const input = 'let x = 5; let y = 10; x + y;';
        const parser = new Parser(input);
        const ast = parser.parse();

        expect(ast).to.deep.equal(
            new ASTNode('Program', [
                new ASTNode('VariableDeclaration', [
                    new ASTNode('Identifier', [new ASTNode('x')]),
                    new ASTNode('NumberLiteral', [new ASTNode('5')])
                ]),
                new ASTNode('VariableDeclaration', [
                    new ASTNode('Identifier', [new ASTNode('y')]),
                    new ASTNode('NumberLiteral', [new ASTNode('10')])
                ]),
                new ASTNode('ExpressionStatement', [
                    new ASTNode('Addition', [
                        new ASTNode('Identifier', [new ASTNode('x')]),
                        new ASTNode('Identifier', [new ASTNode('y')])
                    ])
                ])
            ])
        );
    });

    it('throws error on invalid syntax', () => {
        const input = '2 + * 3;';
        const parser = new Parser(input);
        expect(() => parser.parse()).to.throw(ParseError, 'Expected expression');
    });

    it('handles nested expressions', () => {
        const input = '(1 + 2) * (3 - 4);';
        const parser = new Parser(input);
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

    it('throws error on missing semicolon', () => {
        const input = '2 + 3';
        const parser = new Parser(input);
        expect(() => parser.parse()).to.throw(ParseError, "Expected ';' after expression");
    });

    it('handles lexer errors', () => {
        const input = '2 + @ * 4;';
        expect(() => new Parser(input)).to.throw(ParseError, 'Lexer error: Unexpected character: @');
    });
});