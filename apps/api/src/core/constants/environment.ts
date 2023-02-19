export class Env {
  static dev = 'dev';
  static prod = 'prod';
  static test = 'test';
  static e2e = 'e2e';

  static get current(): string {
    return process.env.ENV;
  }

  static get filePath(): string {
    if (Env.current === Env.e2e) return '.env.e2e';
    if (Env.current === Env.prod) return '.env.prod';
    return '.env.dev';
  }
}
