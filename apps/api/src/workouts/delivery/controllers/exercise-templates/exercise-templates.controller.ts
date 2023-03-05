import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiNotFoundResponse } from '@nestjs/swagger';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../../../../users/delivery/decorators/user.decorator';
import { User } from '../../../../users/domain/entities/user.entity';
import { CreateExerciseTemplateCommand } from '../../../domain/commands/create-exercise-template/create-exercise-template.command';
import { DeleteExerciseTemplateCommand } from '../../../domain/commands/delete-exercise-template/delete-exercise-template.command';
import { EditExerciseTemplateCommand } from '../../../domain/commands/edit-exercise-template/edit-exercise-template.command';
import { ExerciseTemplate } from '../../../domain/entities/exercise-template/exercise-template.entity';
import { UserExerciseTemplatesQuery } from '../../../domain/queries/user-exercise-templates/user-exercise-templates.query';
import {
  CreateExerciseTemplateDto,
  EditExerciseTemplateDto,
  ExerciseTemplateDto,
} from '../../dto/exercise-template.dto';
import { ExerciseTemplateDtoMapper } from '../../mappers/exercise-template-dto.mapper';

@ApiTags('exercise-templates')
@ApiBearerAuth()
@Controller('workouts/exercises/templates')
export class ExerciseTemplatesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly exerciseTemplateDtoMapper: ExerciseTemplateDtoMapper,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [ExerciseTemplateDto] })
  @Get()
  async getUserExerciseTemplates(@GetUser() user: User) {
    const templates = await this.queryBus.execute<
      UserExerciseTemplatesQuery,
      ExerciseTemplate[]
    >(new UserExerciseTemplatesQuery(user.id));
    return templates.map((template) =>
      this.exerciseTemplateDtoMapper.toDto(template),
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: ExerciseTemplateDto })
  @Post()
  async createExerciseTemplate(
    @GetUser() user: User,
    @Body() dto: CreateExerciseTemplateDto,
  ): Promise<ExerciseTemplateDto> {
    const template = await this.commandBus.execute<
      CreateExerciseTemplateCommand,
      ExerciseTemplate
    >(new CreateExerciseTemplateCommand(user.id, dto.name, { ...dto }));
    return this.exerciseTemplateDtoMapper.toDto(template);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ExerciseTemplateDto })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @Patch('/:id')
  async editExerciseTemplate(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EditExerciseTemplateDto,
  ): Promise<ExerciseTemplateDto> {
    const template = await this.commandBus.execute<
      EditExerciseTemplateCommand,
      ExerciseTemplate
    >(new EditExerciseTemplateCommand(user.id, id, dto));
    return this.exerciseTemplateDtoMapper.toDto(template);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @Delete('/:id')
  async deleteExerciseTemplate(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.commandBus.execute<DeleteExerciseTemplateCommand>(
      new DeleteExerciseTemplateCommand(user.id, id),
    );
  }
}
