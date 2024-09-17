import { Type } from './astTypes';

export class TypeEnvironment {
    private variables: Map<string, Type> = new Map();

    defineVariable(name: string, type: Type): void {
        this.variables.set(name, type);
    }

    getVariable(name: string): Type | undefined {
        return this.variables.get(name);
    }

    hasVariable(name: string): boolean {
        return this.variables.has(name);
    }
}