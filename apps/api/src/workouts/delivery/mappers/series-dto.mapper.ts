import { Injectable } from '@nestjs/common';
import { DtoMapper } from '../../../core/dto.mapper';
import { Series } from '../../domain/entities/series/series.entity';
import { SeriesDto } from '../dto/series.dto';

@Injectable()
export class SeriesDtoMapper implements DtoMapper<Series, SeriesDto> {
  toDto(entity: Series): SeriesDto {
    return {
      id: entity.id,
      repetitions: entity.repetitions,
      weight: entity.weight,
      seconds: entity.seconds,
    };
  }
}
