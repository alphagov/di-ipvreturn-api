import { mock } from "jest-mock-extended";
import { lambdaHandler } from "../../GovNotifyHandler";
import { SendEmailProcessor } from "../../services/SendEmailProcessor";
import { VALID_GOV_NOTIFY_HANDLER_SQS_EVENT } from "../data/sqs-events";
import { AppError } from "../../utils/AppError";
import { HttpCodesEnum } from "../../models/enums/HttpCodesEnum";

const mockedSendEmailRequestProcessor = mock<SendEmailProcessor>();

jest.mock("../../services/SendEmailProcessor", () => {
	return {
		SendEmailProcessor: jest.fn(() => mockedSendEmailRequestProcessor),
	};
});

jest.mock("../../utils/Config", () => {
	return {
		getParameter: jest.fn(() => {return "dgsdgsg";}),
	};
});
describe("GovNotifyHandler", () => {
	it("return success response for govNotify", async () => {
		SendEmailProcessor.getInstance = jest.fn().mockReturnValue(mockedSendEmailRequestProcessor);
		await lambdaHandler(VALID_GOV_NOTIFY_HANDLER_SQS_EVENT, "IPR");

		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(mockedSendEmailRequestProcessor.processRequest).toHaveBeenCalledTimes(1);
	});

	it("returns Bad request when number of records in the SQS message is more than 1", async () => {
		const event = { "Records": [] };
		const response = await lambdaHandler(event, "IPR");
		expect(response.batchItemFailures[0].itemIdentifier).toBe("");
	});

	it("errors when email processor throws AppError", async () => {
		SendEmailProcessor.getInstance = jest.fn().mockImplementation(() => {
			throw new AppError(HttpCodesEnum.SERVER_ERROR, "emailSending - failed: got error while sending email.");
		});
		const response = await lambdaHandler(VALID_GOV_NOTIFY_HANDLER_SQS_EVENT, "IPR");
		expect(response.batchItemFailures[0].itemIdentifier).toBe("");
	});
});
