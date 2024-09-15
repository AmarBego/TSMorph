export class Logger {
    constructor(private context: string) {}

    info(message: string) {
        console.log(`[${this.context}] INFO: ${message}`);
    }

    debug(message: string) {
        console.log(`[${this.context}] DEBUG: ${message}`);
    }

    error(message: string) {
        console.error(`[${this.context}] ERROR: ${message}`);
    }
}