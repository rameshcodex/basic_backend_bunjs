const { V4 } = require("paseto");

const generateToken = async (payload) => {
    // PASETO_PRIVATE_KEY format: "-----BEGIN PRIVATE KEY-----\n..."
    // We need to interpret the \n if loaded as string, but usually .env parsers handle it or we replace literal \n with newline
    const privateKeyPEM = process.env.PASETO_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!privateKeyPEM) {
        throw new Error("PASETO_PRIVATE_KEY is not defined");
    }

    const token = await V4.sign(payload, privateKeyPEM, {
        expiresIn: "2h",
    });
    return token;
};

const verifyToken = async (token) => {
    const publicKeyPEM = process.env.PASETO_PUBLIC_KEY?.replace(/\\n/g, '\n');
    if (!publicKeyPEM) {
        throw new Error("PASETO_PUBLIC_KEY is not defined");
    }
    return await V4.verify(token, publicKeyPEM);
};

module.exports = { generateToken, verifyToken };
