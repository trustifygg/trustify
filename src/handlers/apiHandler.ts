import fs from "node:fs";
import path from "node:path";
import { Hono } from "hono";
import { logger } from "../utils/logger";

export function createApiApp(): Hono {
	const app = new Hono();

	loadMiddlewares(app);
	loadRoutes(app);

	return app;
}

function loadMiddlewares(app: Hono): void {
	const middlewaresPath = path.join(__dirname, "../middlewares");

	if (!fs.existsSync(middlewaresPath)) {
		logger.warning("Middlewares directory not found");
		return;
	}

	const middlewareFiles = fs
		.readdirSync(middlewaresPath)
		.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

	for (const file of middlewareFiles) {
		const filePath = path.join(middlewaresPath, file);

		try {
			const middleware = require(filePath).default || require(filePath);

			if (typeof middleware === "function") {
				app.use(middleware);
				logger.success(`Loaded middleware: ${file}`);
			} else {
				logger.warning(`Middleware at ${filePath} is not a function`);
			}
		} catch (error) {
			logger.error(`Failed to load middleware from ${filePath}:`, error);
		}
	}
}

function loadRoutes(app: Hono): void {
	const routesPath = path.join(__dirname, "../routes");

	if (!fs.existsSync(routesPath)) {
		logger.warning("Routes directory not found");
		return;
	}

	const routeFiles = fs
		.readdirSync(routesPath)
		.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

	for (const file of routeFiles) {
		const filePath = path.join(routesPath, file);

		try {
			const route = require(filePath).default || require(filePath);

			if (route && typeof route === "object" && "routes" in route) {
				app.route(route.path || "/", route.routes);
				logger.success(`Loaded route: ${file} at ${route.path || "/"}`);
			} else if (route instanceof Hono) {
				const routeName = file.replace(/\.(ts|js)$/, "");
				app.route(`/${routeName}`, route);
				logger.success(`Loaded route: ${file} at /${routeName}`);
			} else {
				logger.warning(
					`Route at ${filePath} is not a valid Hono app or route object`,
				);
			}
		} catch (error) {
			logger.error(`Failed to load route from ${filePath}:`, error);
		}
	}
}

export function startApiServer(port: number = 3000): void {
	const app = createApiApp();

	app.get("/", (c) => {
		return c.json({
			message: "Trustify API",
			version: "2.0.0",
			status: "online",
		});
	});

	app.notFound((c) => {
		return c.json(
			{
				error: "Not Found",
				message: "The requested endpoint does not exist",
			},
			404,
		);
	});

	app.onError((err, c) => {
		logger.error("API Error:", err);
		return c.json(
			{
				error: "Internal Server Error",
				message: err.message,
			},
			500,
		);
	});

	logger.info(`Starting API server on port ${port}...`);

	const server = Bun.serve({
		fetch: app.fetch,
		port: port,
	});

	logger.success(`API server running at http://localhost:${server.port}`);
}
