export class Logger {
    static info(message) {
        console.log(message);
    }
    static error(message, error) {
        console.error(message, error ?? '');
    }
    static http(method, url, statusCode, duration) {
        const color = statusCode >= 500 ? '\x1b[31m' : statusCode >= 400 ? '\x1b[33m' : '\x1b[32m';
        const reset = '\x1b[0m';
        this.info(`[HTTP] ${method} ${url} -> ${color}${statusCode}${reset} (${duration}ms)`);
    }
}
