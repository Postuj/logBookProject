import { Logger } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { {{name.pascalCase()}}Command } from "./{{name.paramCase()}}.command";

export type {{name.pascalCase()}}CommandOutput = {};

@CommandHandler({{name.pascalCase()}}Command)
export class {{name.pascalCase()}}Handler implements ICommandHandler<{{name.pascalCase()}}Command> {
  private readonly logger = new Logger({{name.pascalCase()}}Handler.name);

  constructor() {}

  async execute(command: {{name.pascalCase()}}Command): Promise<{{name.pascalCase()}}CommandOutput> {}
}
