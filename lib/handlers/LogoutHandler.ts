import { Request, Response } from "express";
import { AuthManager } from "../managers/AuthManager";

/**
 * Handler for logging out
 */
export class LogoutHandler {

	constructor(private authManager: AuthManager) { }

	/**
	 * Handles http request
	 */
	async handle(req: Request, res: Response) {
		try {
			await this.authManager.logout(
				// @ts-ignore
				req.user.id
			);

			res.setHeader("Set-Cookie", "jwt=true;HttpOnly;Expires=1970-09-07;SameSite=strict;Path=/");

			res.end();
		} catch (err) {
			res.status(401);
			res.json(err);

			console.error("LogoutHandler:", err);
		}
	}

}
