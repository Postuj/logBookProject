import { TestBed } from "@automock/jest";
import { {{name.pascalCase()}}Handler } from "./{{name.paramCase()}}.handler";
import { {{name.pascalCase()}}Query } from "./{{name.paramCase()}}.query";

describe("{{name.pascalCase()}}Handler", () => {
  let uut: {{name.pascalCase()}}Handler;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create({{name.pascalCase()}}Handler).compile();
    uut = unit;
  });
});
