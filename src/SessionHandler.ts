import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { Metrics } from "@aws-lambda-powertools/metrics";
import { Response } from "./utils/Response";
import { ResourcesEnum } from "./models/enums/ResourcesEnum";
// import { AppError } from "./utils/AppError";
import { HttpCodesEnum } from "./utils/HttpCodesEnum";
import { LambdaInterface } from "@aws-lambda-powertools/commons";

const POWERTOOLS_METRICS_NAMESPACE = process.env.POWERTOOLS_METRICS_NAMESPACE ? process.env.POWERTOOLS_METRICS_NAMESPACE : "CIC-CRI";
const POWERTOOLS_LOG_LEVEL = process.env.POWERTOOLS_LOG_LEVEL ? process.env.POWERTOOLS_LOG_LEVEL : "DEBUG";

const logger = new Logger({
  logLevel: POWERTOOLS_LOG_LEVEL,
  serviceName: "SessionHandler",
});

const metrics = new Metrics({ namespace: POWERTOOLS_METRICS_NAMESPACE, serviceName: "SessionHandler" });

class Session implements LambdaInterface {

  @metrics.logMetrics({ throwOnEmptyMetrics: false, captureColdStartMetric: true })
  @logger.injectLambdaContext()
  async handler(event: APIGatewayProxyEvent, _context: any): Promise<APIGatewayProxyResult> {
    switch (event.resource) {
      case ResourcesEnum.SESSION:
        try {
          logger.debug("metrics is", { metrics });
          logger.debug("Event received", { event });

          // add code here

          return new Response(HttpCodesEnum.OK, "OK");

        } catch (err: any) {
          logger.error("An error has occurred.", { err });
          // if (err instanceof AppError) {
          //   return new Response(err.statusCode, err.message);
          // }
          return new Response(HttpCodesEnum.SERVER_ERROR, "An error has occurred");
        }
      default:
      //   throw new AppError("Requested resource does not exist" + { resource: event.resource }, HttpCodesEnum.NOT_FOUND);
      return new Response(HttpCodesEnum.NOT_FOUND, "Resource not found");
    }
  }

}
const handlerClass = new Session();
export const lambdaHandler = handlerClass.handler.bind(handlerClass);