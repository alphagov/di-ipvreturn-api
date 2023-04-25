import { Logger } from "@aws-lambda-powertools/logger";
import { Metrics } from "@aws-lambda-powertools/metrics";

import { AppError } from "../utils/AppError";
import { HttpCodesEnum } from "../models/enums/HttpCodesEnum";
import { Constants } from "../utils/Constants";
import {AuthRequestedEvent} from "../models/PostEvent";
import {BaseEvent} from "../models/BaseEvent";



export class PostEventProcessor {
	private static instance: PostEventProcessor;

	private readonly logger: Logger;

	private readonly metrics: Metrics;

	constructor(logger: Logger, metrics: Metrics) {

		this.logger = logger;
		this.metrics = metrics;
	}

	static getInstance(logger: Logger, metrics: Metrics): PostEventProcessor {
		if (!PostEventProcessor.instance) {
			PostEventProcessor.instance = new PostEventProcessor(logger, metrics);
		}
		return PostEventProcessor.instance;
	}

	parseRequest(data: any): any {
		try {

			const obj = JSON.parse(data);
			console.log(obj);
			console.log("Evnt name "+obj.event_name)

			if(obj.event_name === Constants.AUTH_EVENT_TYPE){
				return new AuthRequestedEvent(obj);
			}else if(Constants.BASE_EVENT_TYPES.includes(obj.event_name)){
				return new BaseEvent(obj);
			}

		} catch (error: any) {
			console.log("Cannot parse event data", AuthRequestedEvent.name, "parseBody", { data });
			throw new AppError( HttpCodesEnum.BAD_REQUEST, "Cannot parse event data");
		}
	}

	async processRequest(eventBody: any): Promise<any> {
		try {
			const postEvent = this.parseRequest(JSON.stringify(eventBody));
			console.log(postEvent);
			return {
				statusCode: HttpCodesEnum.CREATED,
				body: JSON.stringify(postEvent),
			};
		 } catch (err: any) {
		 	return new Response(err.statusCode, err.message);
		 }
	}
}
