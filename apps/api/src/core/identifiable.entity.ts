import { Entity } from './entity';

export abstract class IdentifiableEntity extends Entity {
  constructor(public readonly id: string) {
    super();
  }
}
