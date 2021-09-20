import jwt from "jwt-simple";
import ms from "ms";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../config";
import { SessionModel } from "../models/SessionModel";
import { UserViewModel } from "../models/UserModel";
import { SessionRepo } from "../repos/SessionRepo";
import { UserRepo } from "../repos/UserRepo";
import { randomBytes } from "../utils/crypto-utils";
import { PasswordManager } from "./PasswordManager";

interface JwtTokenOutput {
	sessionId: string;
	exp: number;
	user: UserViewModel
}

/**
 * Manager for everything authentication related.
 */
export class AuthManager {

	constructor(private sessionRepo: SessionRepo, private userRepo: UserRepo, private passwordManager: PasswordManager) { }

	/**
	 * Logs a user in
	 */
	async login(username: string, password: string) {
		if (!await this.passwordManager.validatePasswordForUser(password, username))
			throw "Invalid username and/or password";

		const user = await this.userRepo.getByUsername(username);

		if (!user)
			throw new Error("user not found");

		return this.generateNewSession(user?.toViewModel());
	}

	/**
	 * Generates a new session for a user
	 */
	private async generateNewSession(user: UserViewModel) {
		const sessionToken = await randomBytes(128);
		const session = await this.sessionRepo.saveSession(new SessionModel(user.id, sessionToken));
		const jwtToken = await this.generateJwtToken(user, session!.sessionId);

		return jwtToken;
	}

	/**
	 * Generates a jwt token for a user
	 */
	private generateJwtToken(user: UserViewModel, sessionToken: string) {
		const jwtObject = { exp: this.getExpirationDate(), user, sessionId: sessionToken };
		return jwt.encode(jwtObject, JWT_SECRET);
	}

	/**
	 * Prepares expiration date
	 */
	private getExpirationDate() {
		return (Date.now() + ms(JWT_EXPIRES_IN)) / 1000;
	}

	/**
	 * Decodes a jwt token
	 */
	decodeJwtToken(jwtToken: string): JwtTokenOutput {
		return jwt.decode(jwtToken, JWT_SECRET);
	}

	/**
	 * Logs a user out
	 */
	async logout(userId: string) {
		await this.sessionRepo.deleteSessionsByUserId(userId);
	}

	/**
	 * Validates if an inputted session token was the session token for the inputted user's current session.
	 */
	async validateSession(userId: string, sessionToken: string) {
		const session = await this.sessionRepo.getSessionByUserId(userId);

		if (session?.sessionId === sessionToken)
			return true;
		else
			return false;
	}

}
