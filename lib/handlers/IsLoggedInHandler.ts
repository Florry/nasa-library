import { Request, Response } from "express";

/**
 * Used by frontend's ssr to determine if you are logged in or not
 */
export class IsLoggedInHandler {

	/** Note: this endpoint has the middleware running on it so it will not reach the handler if not authenticated */
	async handle(_req: Request, res: Response) {
		res.json({ loggedIn: true });
	}

}
