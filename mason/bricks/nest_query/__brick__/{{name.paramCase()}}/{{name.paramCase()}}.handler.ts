import { Logger } from "@nestjs/common";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { {{name.pascalCase()}}Query } from "./{{name.paramCase()}}.query";

@QueryHandler({{name.pascalCase()}}Query)
export class {{name.pascalCase()}}Handler implements IQueryHandler<{{name.pascalCase()}}Query> {
  private readonly logger = new Logger({{name.pascalCase()}}Handler.name);

  constructor() {}

  async execute(query: {{name.pascalCase()}}Query): Promise<void> {}
}
