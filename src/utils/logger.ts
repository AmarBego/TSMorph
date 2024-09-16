export class Logger {
    constructor(private context: string) {}

    info(message: string): void {
        console.log(`[${this.context}] INFO: ${message}`);
    }

    debug(message: string): void {
        console.log(`[${this.context}] DEBUG: ${message}`);
    }

    error(message: string): void {
        console.error(`[${this.context}] ERROR: ${message}`);
    }
}