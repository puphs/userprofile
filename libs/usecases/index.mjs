import application from '../application.mjs';
import { validateBySchema } from '../utils/schemaValidation.mjs';
import Response from '../utils/Response.mjs';
import { ValidationError, BadRequestError } from '../utils/error.mjs';

export async function processUsecase({ query: request, req }, useCase) {
  const scope = await application.createScope(req);
  const usecase = scope.resolve(useCase);
  const schema = await usecase.schema(request);
  let response = null;
  let error = null;

  if (Object.values(request).length) {
    try {
      validateBySchema(request, schema);
      response = await usecase.process(request);
    } catch (err) {
      response = await usecase.process({});
      error = err.message;
    }
  } else {
    response = await usecase.process({});
  }

  return { props: { request, response, schema, error } };
}

export async function processUsecaseApi(req, useCase) {
  const scope = await application.createScope(req);
  const usecase = scope.resolve(useCase);
  const schema = await usecase.schema(req);

  try {
    validateBySchema(req, schema);
    const result = await usecase.process(req);
    if (result) {
      return Response.ok(result);
    } else {
      return Response.noContent();
    }
  } catch (err) {
    console.log(err.toString());
    const errName = err.name;
    if (errName === BadRequestError.name || errName === ValidationError.name) {
      return Response.badRequest(err.message);
    } else {
      return Response.internalError();
    }
  }
}
