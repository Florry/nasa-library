import { Request, Response } from "express";
import { PasswordManager } from "../managers/PasswordManager";
import { UserModel } from "../models/UserModel";
import { UserRepo } from "../repos/UserRepo";

/**
 * Handler for creating user
 */
export class CreateUserHandler {

	constructor(private userRepo: UserRepo, private passwordManager: PasswordManager) { }

	/**
	 * Handles http request
	 */
	async handle(req: Request, res: Response) {
		try {
			const username: string = req.body.username;
			const password: string = req.body.password;

			/** Validates if password follows any guidelines for password formatting */
			if (!this.passwordManager.validatePasswordFollowsRegExp(password))
				throw "Invalid password!";

			/** Hashes password */
			const hashDetails = await this.passwordManager.hashPassword(password);

			/** Creates user in database */
			const userToBeCreated = new UserModel(username, hashDetails.hashValue, hashDetails.salt);
			const createdUser = await this.userRepo.createUser(userToBeCreated);

			res.json(createdUser?.toViewModel() ?? {});
		} catch (err) {
			res.status(400);
			res.json(err);

			console.error("CreateUserHandler:", err);
		}
	}

}
