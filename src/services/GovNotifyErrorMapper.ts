//import { AppCodes } from "../models/AppCodes";
// @ts-ignore
import { find } from "lodash";
import { AppError } from "../utils/AppError";
import { HttpCodesEnum } from "../models/enums/HttpCodesEnum";

/**
 * Class to map error received from Gov Notify service to App Error object
 */
export class GovNotifyErrorMapper {
	//
	// private static readonly errorCodeMap = new Map<number, AppCodes[]>([
	// 	[ 400, [ AppCodes.E7408, AppCodes.E7409 ] ],
	// 	[ 403, [ AppCodes.E8306, AppCodes.E5210] ],
	// 	[ 429, [ AppCodes.W4101, AppCodes.E6101] ],
	// 	[ 500, [ AppCodes.E5202] ],
	// ]);

	/**
	 * Method that takes an error raised by SendEmailService and translates the error into an AppError with lambda specific AppCode
	 *
	 * @param govNotifyError
	 */
	map(_statusCode: number, errMessage: string): AppError {
    	const statusCode: number = _statusCode || HttpCodesEnum.SERVER_ERROR;
    	const message: string    = errMessage || "Code error";
    	//const appCode = find(GovNotifyErrorMapper.errorCodeMap.get(statusCode), (el: AppCodes) => {el.match(message)} );
    	const shouldThrow = _statusCode === 500 ? true : false;
    	return new AppError(statusCode, errMessage, { shouldThrow });
	}
}
