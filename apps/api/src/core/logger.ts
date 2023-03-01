import { LogLevel } from '@nestjs/common';
import { Env } from './constants/environment';

export class LoggerOptions {
  static get options(): false | LogLevel[] {
    if (Env.current === Env.e2e || Env.current === Env.test) return false;
    if (Env.current === Env.prod) return ['error', 'log'];
    return ['debug', 'error', 'log', 'warn'];
  }
}
