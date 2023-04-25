import { IsString, IsNotEmpty, IsEmail } from "class-validator";
import {AppError} from "../utils/AppError";
import {HttpCodesEnum} from "../models/enums/HttpCodesEnum";

/**
 * Object to represent data contained in email messages sent by this lambda
 */

export class BaseEvent {

	constructor(data: Partial<BaseEvent>) {
		this.event_name = data.event_name!;
		this.user_id = data.user!.user_id!;
		this.event_id = data.event_id!;
		this.timestamp = data.timestamp!;
		this.timestamp_formatted = data.timestamp_formatted!;
		this.user = {user_id: data.user!.user_id!};
	}


	@IsNotEmpty()
	user!: {user_id: string};

	@IsString()
	@IsNotEmpty()
	event_id!: string;

	@IsString()
	@IsNotEmpty()
	timestamp!: string;

	@IsString()
	@IsNotEmpty()
	timestamp_formatted!: string;

    @IsString()
    @IsNotEmpty()
	user_id!: string;

	@IsString()
	@IsNotEmpty()
	event_name!: string;

}
