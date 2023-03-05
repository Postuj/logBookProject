import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../../../../users/delivery/decorators/user.decorator';
import { User } from '../../../../users/domain/entities/user.entity';
import { CreateWorkoutCommand } from '../../../domain/commands/create-workout/create-workout.command';
import { DeleteWorkoutCommand } from '../../../domain/commands/delete-workout/delete-workout.command';
import { EditWorkoutCommand } from '../../../domain/commands/edit-workout/edit-workout.command';
import { Workout } from '../../../domain/entities/workout/workout.entity';
import { UserWorkoutsQuery } from '../../../domain/queries/user-workouts/user-workouts.query';
import {
  CreateWorkoutDto,
  EditWorkoutDto,
  WorkoutDto,
} from '../../dto/workout.dto';
import { WorkoutDtoMapper } from '../../mappers/workout-dto-mapper';

@ApiTags('workouts')
@ApiBearerAuth()
@Controller('workouts')
export class WorkoutsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly workoutDtoMapper: WorkoutDtoMapper,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: WorkoutDto })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @Post()
  async createWorkout(
    @GetUser() user: User,
    @Body() dto: CreateWorkoutDto,
  ): Promise<WorkoutDto> {
    const workout = await this.commandBus.execute<
      CreateWorkoutCommand,
      Workout
    >(new CreateWorkoutCommand(user.id, dto));
    return this.workoutDtoMapper.toDto(workout);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [WorkoutDto] })
  @Get()
  async getUserWorkouts(@GetUser() user: User): Promise<WorkoutDto[]> {
    const workouts = await this.queryBus.execute<UserWorkoutsQuery, Workout[]>(
      new UserWorkoutsQuery(user.id),
    );
    return workouts.map((workout) => this.workoutDtoMapper.toDto(workout));
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: WorkoutDto })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @Patch('/:id')
  async editWorkout(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EditWorkoutDto,
  ): Promise<WorkoutDto> {
    const workout = await this.commandBus.execute<EditWorkoutCommand, Workout>(
      new EditWorkoutCommand(user.id, id, dto),
    );
    return this.workoutDtoMapper.toDto(workout);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @Delete('/:id')
  async deleteWorkout(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.commandBus.execute<DeleteWorkoutCommand>(
      new DeleteWorkoutCommand(user.id, id),
    );
  }
}
