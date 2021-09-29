import { Request, Response } from "express";
import ms from "ms";
import { AUTHENTICATION_TOKEN_NAME_OUT } from "../constants/autentication-constants";
import { AuthManager } from "../managers/AuthManager";
import { UserRepo } from "../repos/UserRepo";

/**
 * Handler for logging in.
 */
export class LoginHandler {

	constructor(private userRepo: UserRepo, private authManager: AuthManager) { }

	/**
	 * Handles http request
	 */
	async handle(req: Request, res: Response) {
		try {
			const username = req.body.username;
			const password = req.body.password;
			const authToken = await this.authManager.login(username, password);
			const user = await this.userRepo.getByUsername(username);

			res.setHeader(AUTHENTICATION_TOKEN_NAME_OUT, authToken);

			const expires = new Date(Date.now() + ms("1d")).toUTCString();
			// TODO: implement better cookie setting, path should never be / !
			res.setHeader("Set-Cookie", "jwt=" + authToken + ";HttpOnly;Expires=" + expires + ";SameSite=strict;Path=/");


			res.json(user?.toViewModel() ?? {});
		} catch (err) {
			res.status(401);
			res.json(err);

			console.error("LoginHandler:", err);
		}
	}

}
