import { NextFunction, Request, Response } from "express";
import { AUTHENTICATION_TOKEN_NAME } from "../constants/autentication-constants";
import { AuthManager } from "../managers/AuthManager";
import { UserViewModel } from "../models/UserModel";

let _authManager: AuthManager;

/**
 * middleware for checking authentication token
 * and setting logged in user (req.user) if one was found
 * and successfully decoded and verified
 */
export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
	let jwtToken = req.cookies.jwt;

	if (!jwtToken) {
		jwtToken = req.headers[AUTHENTICATION_TOKEN_NAME.toLowerCase()] as string;

		if (jwtToken)
			jwtToken = jwtToken.replace("Bearer ", "");
	}

	if (!jwtToken)
		badRequest(res);
	else {
		try {
			const decodedJwtToken = _authManager.decodeJwtToken(jwtToken);
			const sessionId = decodedJwtToken.sessionId;
			const expirationDate = new Date(decodedJwtToken.exp * 1000);
			const user: UserViewModel = decodedJwtToken.user;

			if (expirationDate <= new Date())
				unAuth(res);
			else {
				if (!_authManager.validateSession(user.id, sessionId))
					unAuth(res);
				else
					// @ts-ignore
					req.user = user;
			}

			return next();
		} catch (err) {
			console.error("error", err);
			unAuth(res);
		}
	}
}

function badRequest(res: Response) {
	res.status(400);
	res.end("");
}

function unAuth(res: Response) {
	res.status(401);
	res.end();
}

export function initAuthenticateUserMiddleware(authManager: AuthManager) {
	_authManager = authManager;
}
