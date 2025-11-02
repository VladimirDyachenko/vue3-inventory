export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none'

interface LoggerOptions {
  prefix?: string
  level?: LogLevel
  enabled?: boolean
  color?: string
}

const levelOrder: Record<LogLevel, number> = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  none: 99,
}

const defaultColors: Record<LogLevel, string> = {
  debug: '#909399',
  info: '#42b983',
  warn: '#e6a23c',
  error: '#f56c6c',
  none: '#000000',
}

/**
 * Базовая реальзация логгера.
 * const myFeatureLogger = new Logger({prefix: "myPrefix"});
 * myFeatureLogger.warn("Важное сообщение")
 * @export
 * @class Logger
 * @typedef {Logger}
 */
export class Logger {
  private prefix: string
  private level: LogLevel
  private enabled: boolean
  private color?: string

  constructor(options: LoggerOptions = {}) {
    this.prefix = options.prefix ?? '[App]'
    this.level = options.level ?? (import.meta.env.DEV ? 'debug' : 'warn')
    this.enabled = options.enabled ?? true
    this.color = options.color
  }

  private canLog(level: LogLevel): boolean {
    return this.enabled && levelOrder[level] >= levelOrder[this.level]
  }

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (!this.canLog(level)) return
    const color = this.color || defaultColors[level]
    const time = new Date().toISOString()
    const styledPrefix = `%c[${this.prefix}] [${time}] ${level.toUpperCase()}:`
    console.log(styledPrefix, `color:${color}`, message, ...args)
  }

  debug(msg: string, ...args: unknown[]): void {
    this.log('debug', msg, ...args)
  }

  info(msg: string, ...args: unknown[]): void {
    this.log('info', msg, ...args)
  }

  warn(msg: string, ...args: unknown[]): void {
    this.log('warn', msg, ...args)
  }

  error(msg: string, ...args: unknown[]): void {
    this.log('error', msg, ...args)
  }

  setLevel(level: LogLevel): void {
    this.level = level
  }

  enable(): void {
    this.enabled = true
  }

  disable(): void {
    this.enabled = false
  }
}
