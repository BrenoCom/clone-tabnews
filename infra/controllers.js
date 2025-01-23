import { InternalServerError, MethodNotAllowedError } from "./errors";

// handlers para requisições via next-connect


function onErrorHandler(error, req, res) {
  const publicErrorObj = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.error(publicErrorObj);

  res.status(publicErrorObj.statusCode).json(publicErrorObj);
}

function onNoMatchHandler(req, res) {
  const errorMethodNotAllowed = new MethodNotAllowedError();
  res.status(errorMethodNotAllowed.statusCode).json(errorMethodNotAllowed);
}

const defaulRoutetHandlerOptions = {
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
};

const controllerExports = {
  errorHandlers: defaulRoutetHandlerOptions
}

export default controllerExports;
