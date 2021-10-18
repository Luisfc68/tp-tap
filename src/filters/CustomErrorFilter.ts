import {Catch, PlatformContext, ExceptionFilterMethods, ResponseErrorObject} from "@tsed/common";
import {Exception} from "@tsed/exceptions";

@Catch(Exception)
@Catch(Error)
export class CustomErrorFilter implements ExceptionFilterMethods {

  //Mapea a una tupla con mensaje y status http por si se quiere poner un status diferente
  private readonly kwownErrors:Map<string,[string,number?]> = new Map([
    ["AJV_VALIDATION_ERROR", ["Validation error"]],
    ["TypeError", ["Image not provided",400]]
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

    let knownName:string|undefined,knownStatus:number|undefined;
    let name:string = error.origin?.name || error.name;

    if(this.kwownErrors.has(name)){
      knownName =  this.kwownErrors.get(name)![0];
      knownStatus = this.kwownErrors.get(name)![1]
    }

    return {
      name: knownName || name,
      message: error.message,
      status: error.status || knownStatus || 500
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
