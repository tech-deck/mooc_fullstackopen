const logger = require("./logger");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const requestLogger = (request, response, next) => {
	logger.info("Method:", request.method);
	logger.info("Path:  ", request.path);
	logger.info("Body:  ", request.body);
	logger.info("---");
	next();
};

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

const tokenExtractor = (request, response, next) => {
	let authorization = request.get("authorization");
    console.log('authorization: ', authorization);
	if (authorization && authorization.startsWith("Bearer ")) {
		request.token = authorization.replace("Bearer ", "");
		logger.info("setting request.token to", request.token);
	} else {
		logger.info("no Bearer authorization token found.");
	}
	next();
};

const userExtractor = async (request, response, next) => {
	console.log("request.token: ", request.token);
	if (request.token !== undefined) {
		let decodedToken = jwt.verify(request.token, process.env.SECRET);
		console.log("decodedToken: ", decodedToken);
		console.log("decodedToken.id:", decodedToken.id);
		if (decodedToken.id !== undefined) {
			const user = await User.findById(decodedToken.id);
			request.user = user;
			logger.info("setting request.user to ", user);
		} else {
			logger.info("no user logged in.");
		}
	}
	next();
};

const errorHandler = (error, request, response, next) => {
	logger.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	} else if (error.name === "JsonWebTokenError") {
		return response.status(401).json({ error: error.message });
	}
	next(error);
};

module.exports = {
	requestLogger,
	unknownEndpoint,
	tokenExtractor,
	userExtractor,
	errorHandler,
};
