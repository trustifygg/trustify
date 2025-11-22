import type { MiddlewareHandler } from "hono";
import { logger } from "../utils/logger";

const requestLogger: MiddlewareHandler = async (c, next) => {
	const start = Date.now();
	const method = c.req.method;
	const path = c.req.path;

	logger.info(`→ ${method} ${path}`);

	await next();

	const status = c.res.status;
	const duration = Date.now() - start;

	logger.info(`← ${method} ${path} ${status} (${duration}ms)`);
};

export default requestLogger;
