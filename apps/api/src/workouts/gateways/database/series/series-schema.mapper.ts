import { Injectable } from '@nestjs/common/decorators';
import { EntitySchemaMapper } from '../../../../database/entity-schema.factory';
import { Series } from '../../../domain/entities/series/series.entity';
import { SeriesSchema } from './series.schema';

@Injectable()
export class SeriesSchemaMapper
  implements EntitySchemaMapper<SeriesSchema, Series>
{
  toSchema(entity: Series): SeriesSchema {
    return {
      id: entity.id ?? undefined,
      exerciseId: entity.exerciseId,
      repetitions: entity.repetitions,
      weight: entity.weight,
      seconds: entity.seconds,
    } as SeriesSchema;
  }
  fromSchema(schema: SeriesSchema): Series {
    return new Series(schema.id, schema.exerciseId, {
      repetitions: schema.repetitions,
      weight: schema.weight,
      seconds: schema.seconds,
    });
  }
}
