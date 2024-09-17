import { expect } from 'chai';
import { compile } from '../../src/compiler';
import { ASTNode } from '../../src/parser/parser';
import sinon from 'sinon';
import { Logger } from '../../src/utils/logger';

describe('TypeChecker', () => {
    it('throws error for undefined variables', () => {
        const input = 'x = 5;';
        expect(() => compile(input)).to.throw('Type error: Undefined variable x');
    });

    it('checks type consistency in expressions', () => {
        const input = 'let x = 5 + "hello";';
        expect(() => compile(input)).to.throw('Type error: Operands must be numbers');
    });

    // ... other tests
});