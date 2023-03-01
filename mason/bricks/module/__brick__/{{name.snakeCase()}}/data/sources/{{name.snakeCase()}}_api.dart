import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:retrofit/http.dart';

import '../../../../core/data/sources/env.dart';

part '{{name.snakeCase()}}_api.g.dart';

@injectable
@RestApi(baseUrl: 'http://localhost:3000/{{name.paramCase()}}')
abstract class {{name.pascalCase()}}Api {
  @factoryMethod
  static {{name.pascalCase()}}Api create(Dio dio) =>
      _{{name.pascalCase()}}Api(dio, baseUrl: '${Env.apiUrl}/{{name.paramCase()}}');

  factory {{name.pascalCase()}}Api(Dio dio) => _{{name.pascalCase()}}Api(dio);
}
