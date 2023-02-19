import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class IdentifiableEntitySchema {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;
}
