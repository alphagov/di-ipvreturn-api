import { IsString, IsNotEmpty } from "class-validator";

import {BaseEvent} from "./BaseEvent";

/**
 * Object to represent data contained in email messages sent by this lambda
 */

export class AuthRequestedEvent extends BaseEvent{

	constructor(data: Partial<AuthRequestedEvent>) {
		super(data);
		this.component_id = data.component_id!;
		this.user = {user_id: data.user!.user_id!, email: data.user!.email! };
	}


	@IsString()
	@IsNotEmpty()
	component_id!: string;

	@IsNotEmpty()
	user!: {user_id: string, email: string};

}
