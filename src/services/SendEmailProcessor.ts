import { Email } from "../models/Email";
import { EmailResponse } from "../models/EmailResponse";
import { ServicesEnum } from "../models/enums/ServicesEnum";
import { ValidationHelper } from "../utils/ValidationHelper";
import { createDynamoDbClient } from "../utils/DynamoDBFactory";
import { buildCoreEventFields } from "../utils/TxmaEvent";
import { Logger } from "@aws-lambda-powertools/logger";
import { Metrics } from "@aws-lambda-powertools/metrics";
import { SendEmailService } from "./SendEmailService";
import { IPRService } from "./IPRService";
import { EnvironmentVariables } from "./EnvironmentVariables";

export class SendEmailProcessor {

	private static instance: SendEmailProcessor;

	private readonly logger: Logger;

	private readonly metrics: Metrics;

	private readonly sessionEventsTable: string;

	private readonly validationHelper: ValidationHelper;

	private readonly govNotifyService: SendEmailService;

	private readonly iprService: IPRService;

	constructor(logger: Logger, metrics: Metrics, GOVUKNOTIFY_API_KEY: string, sessionEventsTable: string) {
		this.logger = logger;
		this.validationHelper = new ValidationHelper();
		this.metrics = metrics;
		this.govNotifyService = SendEmailService.getInstance(this.logger, GOVUKNOTIFY_API_KEY);
		this.sessionEventsTable = sessionEventsTable;
		this.iprService = IPRService.getInstance(this.sessionEventsTable, this.logger, createDynamoDbClient());
	}

	static getInstance(logger: Logger, metrics: Metrics, GOVUKNOTIFY_API_KEY: string, sessionEventsTable: string): SendEmailProcessor {
		if (!SendEmailProcessor.instance) {
			SendEmailProcessor.instance = new SendEmailProcessor(logger, metrics, GOVUKNOTIFY_API_KEY, sessionEventsTable);
		}
		return SendEmailProcessor.instance;
	}

	async processRequest(eventBody: any): Promise<EmailResponse> {
		const email = Email.parseRequest(JSON.stringify(eventBody.Message));

		await this.validationHelper.validateModel(email, this.logger);

		const emailResponse: EmailResponse = await this.govNotifyService.sendEmail(email);

		await this.iprService.sendToTXMA({
			event_name: "IPR_RESULT_NOTIFICATION_EMAILED",
			...buildCoreEventFields({ email: email.emailAddress }),
		});

		this.logger.info("Response after sending Email message", { emailResponse });
		return emailResponse;
	}
}

