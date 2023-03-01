import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Get,
  Param,
  Delete,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ApiCreatedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { GetUser } from '../../../../users/delivery/decorators/user.decorator';
import { User } from '../../../../users/domain/entities/user.entity';
import { CreateWorkoutTemplateCommand } from '../../../domain/commands/create-workout-template/create-workout-template.command';
import { DeleteWorkoutTemplateCommand } from '../../../domain/commands/delete-workout-template/delete-workout-template.command';
import { EditWorkoutTemplateCommand } from '../../../domain/commands/edit-workout-template/edit-workout-template.command';
import { WorkoutTemplate } from '../../../domain/entities/workout-template/workout-template.entity';
import { UserWorkoutTemplatesQuery } from '../../../domain/queries/user-workout-templates/user-workout-templates.query';
import {
  CreateWorkoutTemplateDto,
  WorkoutTemplateDto,
} from '../../dto/workout-template.dto';
import { WorkoutTemplateDtoMapper } from '../../mappers/workout-template-dto.mapper';

@ApiTags('workout-templates')
@ApiBearerAuth()
@Controller('workout-templates')
export class WorkoutTemplatesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly workoutTemplateDtoMapper: WorkoutTemplateDtoMapper,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [WorkoutTemplateDto] })
  @Get()
  async getUserTemplates(@GetUser() user: User): Promise<WorkoutTemplateDto[]> {
    const templates = await this.queryBus.execute<
      UserWorkoutTemplatesQuery,
      WorkoutTemplate[]
    >(new UserWorkoutTemplatesQuery(user.id));
    return templates.map((template) =>
      this.workoutTemplateDtoMapper.toDto(template),
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: WorkoutTemplateDto })
  @Post()
  async createTemplate(
    @GetUser() user: User,
    @Body() dto: CreateWorkoutTemplateDto,
  ): Promise<WorkoutTemplateDto> {
    const template = await this.commandBus.execute<
      CreateWorkoutTemplateCommand,
      WorkoutTemplate
    >(
      new CreateWorkoutTemplateCommand(
        user.id,
        dto.name,
        dto.exerciseTemplateIds,
      ),
    );
    return this.workoutTemplateDtoMapper.toDto(template);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: WorkoutTemplateDto })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @Patch('/:id')
  async editExerciseTemplate(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: WorkoutTemplateDto,
  ): Promise<WorkoutTemplateDto> {
    const template = await this.commandBus.execute<
      EditWorkoutTemplateCommand,
      WorkoutTemplate
    >(new EditWorkoutTemplateCommand(user.id, id, dto));
    return this.workoutTemplateDtoMapper.toDto(template);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @Delete('/:id')
  async deleteWorkoutTemplate(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.commandBus.execute<DeleteWorkoutTemplateCommand>(
      new DeleteWorkoutTemplateCommand(user.id, id),
    );
  }
}
