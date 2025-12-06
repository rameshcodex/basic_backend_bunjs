const axios = require("axios");
const { EurPairs } = require('../../models/eurPairs')

const addEurPair = async (req, reply) => {
    try {
        const response = await axios.get("https://api.kraken.com/0/public/AssetPairs");
        const data = Object.values(response?.data?.result);

        let total = 0;

        for (const pair of data) {
            const [basecurrency, quotecurrency] = pair.wsname.split("/");

            const createData = {
                symbol: `${basecurrency}_${quotecurrency}`,
                base: basecurrency,
                quote: quotecurrency,
            };

            if (createData.quote === "EUR" && pair.status === "online") {
                const exists = await EurPairs.findOne({ symbol: createData.symbol });

                if (!exists) {
                    console.log("Creating EUR Pair:", createData);
                    await EurPairs.create(createData);
                }

                total++;
            }
        }

        console.log("Total Created/Updated:", total);

        return reply.code(200).send({
            success: true,
            message: "Pairs Processed Successfully",
            result: response.data,
        });
    } catch (error) {
        console.error(error);
        return reply.code(500).send({
            success: false,
            message: "Something went wrong",
        });
    }
};

module.exports = { addEurPair };
