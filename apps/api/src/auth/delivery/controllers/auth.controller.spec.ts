import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterRequestDto } from '../dto/register.dto';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(commandBus).toBeDefined();
  });

  describe('signUp', () => {
    it('should return new tokens on success', async () => {
      // arrange
      const mockRegisterDto: RegisterRequestDto = {
        email: 'test@mail.com',
        password: '123',
      };
      const expectedTokens = {
        accessToken: '123',
        refreshToken: '123',
      };
      jest.spyOn(commandBus, 'execute').mockResolvedValueOnce(expectedTokens);

      // act
      const result = await controller.singUp(mockRegisterDto);

      // assert
      expect(result).toEqual(expectedTokens);
    });
  });
});
