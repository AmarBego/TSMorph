import { expect } from 'chai';
import { compile } from '../src/compiler';
import { ASTNode } from '../src/parser/parser';
import sinon from 'sinon';
import { Logger } from '../src/utils/logger';

describe('Compiler', () => {
    // it('compiles simple arithmetic expressions', () => {
    //     const input = '2 + 3 * 4;';
    //     const ast = compile(input);

    //     expect(ast).to.deep.equal(
    //         new ASTNode('Program', [
    //             new ASTNode('ExpressionStatement', [
    //                 new ASTNode('Addition', [
    //                     new ASTNode('NumberLiteral', [new ASTNode('2')]),
    //                     new ASTNode('Multiplication', [
    //                         new ASTNode('NumberLiteral', [new ASTNode('3')]),
    //                         new ASTNode('NumberLiteral', [new ASTNode('4')])
    //                     ])
    //                 ])
    //             ])
    //         ])
    //     );
    // });
    // it('logs compilation process', () => {
    //     const input = '2 + 3 * 4;';
    //     const logSpy = sinon.spy(console, 'log');
        
    //     compile(input);
    
    //     expect(logSpy.calledWith('[Lexer] INFO: Starting tokenization process')).to.be.true;
    //     expect(logSpy.calledWith('[Lexer] INFO: Tokenization completed')).to.be.true;
    //     expect(logSpy.calledWith('[Parser] INFO: Initializing parser')).to.be.true;
    //     expect(logSpy.calledWith('[Parser] INFO: Starting parsing process')).to.be.true;
    //     expect(logSpy.calledWith('[Parser] INFO: Parsing completed successfully')).to.be.true;
    
    //     logSpy.restore();
    // });
    // it('handles lexer and parser errors', () => {
    //     expect(() => compile('2 + @ * 4;')).to.throw('Unexpected character: @');
    //     expect(() => compile('2 +')).to.throw("Expected expression.");
    // });
    // it('handles complex arithmetic expressions', () => {
    //     const input = '(2 + 3) * 4 - 5 / 2.5;';
    //     const ast = compile(input);
    
    //     expect(ast).to.deep.equal(
    //         new ASTNode('Program', [
    //             new ASTNode('ExpressionStatement', [
    //                 new ASTNode('Subtraction', [
    //                     new ASTNode('Multiplication', [
    //                         new ASTNode('GroupingExpression', [
    //                             new ASTNode('Addition', [
    //                                 new ASTNode('NumberLiteral', [new ASTNode('2')]),
    //                                 new ASTNode('NumberLiteral', [new ASTNode('3')])
    //                             ])
    //                         ]),
    //                         new ASTNode('NumberLiteral', [new ASTNode('4')])
    //                     ]),
    //                     new ASTNode('Division', [
    //                         new ASTNode('NumberLiteral', [new ASTNode('5')]),
    //                         new ASTNode('NumberLiteral', [new ASTNode('2.5')])
    //                     ])
    //                 ])
    //             ])
    //         ])
    //     );
    // });
    it('handles multiple statements', () => {
        const input = 'let x = 5; let y = 10; x + y;';
        const ast = compile(input);

        expect(ast).to.deep.equal(
            new ASTNode('Program', [
                new ASTNode('VariableDeclaration', [
                    new ASTNode('Identifier', [], 'x'),
                    new ASTNode('NumberLiteral', [], '5')
                ]),
                new ASTNode('VariableDeclaration', [
                    new ASTNode('Identifier', [], 'y'),
                    new ASTNode('NumberLiteral', [], '10')
                ]),
                new ASTNode('ExpressionStatement', [
                    new ASTNode('Addition', [
                        new ASTNode('Identifier', [], 'x'),
                        new ASTNode('Identifier', [], 'y')
                    ])
                ])
            ])
        );
    });

    it('handles lexer errors', () => {
        const input = '2 + @ * 4;';
        expect(() => compile(input)).to.throw('Unexpected character: @');
    });
    
    it('handles parser errors', () => {
        const input = '2 +;';
        expect(() => compile(input)).to.throw(Error, 'Parse error: Expected expression');
    });

    it('throws error on missing semicolon', () => {
        const input = '2 + 3';
        expect(() => compile(input)).to.throw(Error, "Parse error: Expected ';' after expression");
    });

    it('handles comments and whitespace', () => {
        const input = `
        // This is a comment
        let x = 5;
        /* This is a
           multi-line comment */
        let y = 10;
        x + y; // Result
        `;
        const ast = compile(input);
    
        expect(ast).to.deep.equal(
            new ASTNode('Program', [
                new ASTNode('VariableDeclaration', [
                    new ASTNode('Identifier', [], 'x'),
                    new ASTNode('NumberLiteral', [], '5')
                ]),
                new ASTNode('VariableDeclaration', [
                    new ASTNode('Identifier', [], 'y'),
                    new ASTNode('NumberLiteral', [], '10')
                ]),
                new ASTNode('ExpressionStatement', [
                    new ASTNode('Addition', [
                        new ASTNode('Identifier', [], 'x'),
                        new ASTNode('Identifier', [], 'y')
                    ])
                ])
            ])
        );
    });
});