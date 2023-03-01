import {
  CreateDateColumn,
  Entity,
  VersionColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export abstract class BaseEntitySchema {
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date = new Date();

  @VersionColumn({ default: 0 })
  version = 0;
}
