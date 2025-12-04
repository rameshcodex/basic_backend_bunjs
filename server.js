require("dotenv-safe").config();

const path = require("path");
const fastify = require("fastify")({
    logger: false,
});

const fastifyCors = require("@fastify/cors");
const fastifyHelmet = require("@fastify/helmet");
const fastifyCompress = require("@fastify/compress");
const fastifyFormbody = require("@fastify/formbody");
const fastifyStatic = require("@fastify/static");
const fastifyView = require("@fastify/view");
const ejs = require("ejs");
const { Server } = require("socket.io");

// Redis optional
let fastifyRedis, expeditious, expeditiousRedis;
if (process.env.USE_REDIS === "true") {
    fastifyRedis = require("@fastify/redis");
    expeditious = require("expeditious");
    expeditiousRedis = require("expeditious-engine-redis");
}


// ----------------
// REGISTER PLUGINS
// ----------------

// CORS
fastify.register(fastifyCors, {
    origin: "*",
    credentials: true,
});

// Helmet security
fastify.register(fastifyHelmet);

// Compression
fastify.register(fastifyCompress);

// Body parser
fastify.register(fastifyFormbody, {
    bodyLimit: 20 * 1024 * 1024,
});


// Views (EJS)
fastify.register(fastifyView, {
    engine: { ejs },
    root: path.join(__dirname, "views"),
});

// Static directory /public
fastify.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
    prefix: "/public/",
});

// /testapi path
fastify.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
    prefix: "/testapi/",
    decorateReply: false,
});

// Redis cache plugin
if (process.env.USE_REDIS === "true") {
    fastify.register(fastifyRedis, {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    });
}

// -------------
// ROUTES
// -------------
fastify.register(require("./app/routes"));

// -------------
// SOCKET.IO
// -------------
const server = fastify.server;
const io = new Server(server, {
    cors: { origin: "*", credentials: true },
});

let sockets = null;

io.on("connection", (socket) => {
    sockets = socket;

    socket.on("join", (data) => {
        socket.join(data.room);
    });

    socket.on("send_message1", (data) => {
        socket.to(data.room).emit("receive_message1", data);
    });

    socket.on("disconnect", () => { });
});

// -------------
// ERROR HANDLING
// -------------
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception:", err);
});
process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection:", err);
});

// ----------
// START SERVER
// ----------
const PORT = process.env.PORT || 3000;

fastify.listen({ port: PORT }).then(() => {
    console.log("🚀 Fastify + Bun running on port", PORT);
});

module.exports = { sockets };
