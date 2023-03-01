export class E2EAppUser {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly accessToken: string,
    public readonly refreshToken: string,
  ) {}
}

export class E2EExerciseTemplate {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdById: string,
    public readonly hasRepetitions: boolean,
    public readonly hasWeight: boolean,
    public readonly hasTime: boolean,
  ) {}
}
