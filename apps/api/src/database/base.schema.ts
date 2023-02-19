import {
  CreateDateColumn,
  Entity,
  VersionColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IdentifiableEntitySchema } from './identifiable-entity.schema';

@Entity()
export abstract class BaseSchema extends IdentifiableEntitySchema {
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date = new Date();

  @VersionColumn({ default: 0 })
  version = 0;
}
