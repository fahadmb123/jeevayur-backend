export class Logger {
  public static info(message: string): void {
    console.log(message);
  }

  public static error(message: string, error?: unknown): void {
    console.error(message, error ?? '');
  }

  public static http(method: string, url: string, statusCode: number, duration: number): void {
    const color = statusCode >= 500 ? '\x1b[31m' : statusCode >= 400 ? '\x1b[33m' : '\x1b[32m';
    const reset = '\x1b[0m';
    this.info(`[HTTP] ${method} ${url} -> ${color}${statusCode}${reset} (${duration}ms)`);
  }
}
