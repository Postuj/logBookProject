import { IdentifiableEntity } from '../../../core/identifiable.entity';

export class User extends IdentifiableEntity {
  constructor(id: string, public readonly email: string) {
    super(id);
  }
}
