import { IncomingMessage } from "http";
import { NextPageContext } from "next";

interface AuthenticatedRequest extends IncomingMessage {

	cookies: Record<string, string>;

	user: {};

}

export interface AuthenticatedPageContext extends NextPageContext {

	req: AuthenticatedRequest;

}
