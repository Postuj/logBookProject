import 'package:injectable/injectable.dart';
import 'package:mobile/features/{{name.snakeCase()}}/data/sources/{{name.snakeCase()}}_api.dart';
import 'package:mobile/features/{{name.snakeCase()}}/domain/repositories/{{name.snakeCase()}}_repository.dart';

@Injectable(as: {{name.pascalCase()}}Repository, env: ['dev', 'prod'])
class {{name.pascalCase()}}RepositoryImpl implements {{name.pascalCase()}}Repository {
  final {{name.pascalCase()}}Api _{{name.camelCase()}}Api;

  {{name.pascalCase()}}RepositoryImpl({
    required {{name.pascalCase()}}Api {{name.camelCase()}}Api,
  }) : _{{name.camelCase()}}Api = {{name.camelCase()}}Api;

}
