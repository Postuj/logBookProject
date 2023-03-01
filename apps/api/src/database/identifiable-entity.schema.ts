import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntitySchema } from './base.schema';

export abstract class IdentifiableEntitySchema extends BaseEntitySchema {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;
}
