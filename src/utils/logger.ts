enum LogLevel {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

class Logger {
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  info(message: string): void {
    console.log(`${this.formatMessage(LogLevel.INFO, message)}`);
  }

  success(message: string): void {
    console.log(`${this.formatMessage(LogLevel.SUCCESS, message)}`);
  }

  warning(message: string): void {
    console.warn(`${this.formatMessage(LogLevel.WARNING, message)}`);
  }

  error(message: string, error?: Error | unknown): void {
    console.error(`${this.formatMessage(LogLevel.ERROR, message)}`);
    if (error) {
      if (error instanceof Error) {
        console.error('Stack trace:', error.stack);
      } else {
        console.error('Error details:', error);
      }
    }
  }

  debug(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${this.formatMessage(LogLevel.DEBUG, message)}`);
      if (data) {
        console.log('Debug data:', data);
      }
    }
  }
}

export const logger = new Logger();
