import {Catch, PlatformContext, ExceptionFilterMethods, ResponseErrorObject} from "@tsed/common";
import {Exception} from "@tsed/exceptions";

@Catch(Exception)
export class CustomErrorFilter implements ExceptionFilterMethods {

  private readonly kwownErrors:Map<string,string> = new Map([
    ["AJV_VALIDATION_ERROR", "Validation error"]
  ]);

  catch(exception: Exception, ctx: PlatformContext) {
    const {response, logger} = ctx;
    const error = this.mapError(exception);
    const headers = this.getHeaders(exception);

    logger.error({
      error
    });

    response
      .setHeaders(headers)
      .status(error.status)
      .body(error);
  }

  mapError(error: any) {
    let name:string = error.origin?.name || error.name;
    return {
      name: this.kwownErrors.get(name) || name,
      message: error.message,
      status: error.status || 500
    };
  }

  protected getErrors(error: any) {
    return [error, error.origin]
           .filter(Boolean)
           .reduce((errs, {errors}: ResponseErrorObject) => {
              return [...errs, ...(errors || [])];
            }, []);
  }

  protected getHeaders(error: any) {
    return [error, error.origin].filter(Boolean).reduce((obj, {headers}: ResponseErrorObject) => {
      return {
        ...obj,
        ...(headers || {})
      };
    }, {});
  }
}
