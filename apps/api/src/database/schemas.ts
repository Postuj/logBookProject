import { Env } from '../core/constants/environment';

const schemaNames = {
  [Env.dev]: 'dev',
  [Env.prod]: 'prod',
  [Env.test]: 'public',
  [Env.e2e]: 'public',
};

export interface SchemaOptions {
  schema: string;
  dropSchema: boolean;
  synchronize: boolean;
}

export class DatabaseSchemas {
  static get schemaOptions(): SchemaOptions {
    return {
      schema: DatabaseSchemas.schemaName,
      dropSchema: DatabaseSchemas.shouldDropSchema,
      synchronize: DatabaseSchemas.shouldSynchronizeSchema,
    };
  }

  private static get schemaName(): string {
    return schemaNames[Env.current] ?? 'public';
  }

  private static get shouldDropSchema(): boolean {
    return Env.current === Env.e2e;
  }

  private static get shouldSynchronizeSchema(): boolean {
    return Env.current !== Env.prod;
  }
}
