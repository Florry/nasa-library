import { v4 as uuid } from "uuid";

interface UserMetadata {
	created: Date;
}

/**
 * Model for a user account
 */
export class UserModel {

	id: string;

	metadata: UserMetadata;

	constructor(public username: string, public hashedPassword: string, public salt: string, created?: Date, id?: string) {
		this.username = username;
		this.hashedPassword = hashedPassword;
		this.salt = salt;

		if (id)
			this.id = id;
		else
			this.id = uuid();

		if (created)
			this.metadata = { created };
		else
			this.metadata = { created: new Date() }
	}

	toViewModel() {
		return new UserViewModel(this);
	}

}

export class UserViewModel {

	username: string;
	id: string;
	metadata: UserMetadata;

	constructor(user: UserModel) {
		this.username = user.username;
		this.id = user.id;
		this.metadata = user.metadata;
	}

};
