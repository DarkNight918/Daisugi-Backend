const axios = require('axios');
const RichAddressData = require('../models/address_rich')
const cron = require("node-cron");

// OkLink ------------------ get rich addresses information for each chain

const getRichAddressData = async () => {

  const config = {
    headers: {
      "Ok-Access-Key": process.env.OKLINK_API_KEY,
    }
  }

  const chainListAPI = 'https://www.oklink.com/api/v5/explorer/blockchain/summary'

  try {

    const response = await axios.get(chainListAPI, config);
    const chains = response.data.data;

    RichAddressData.deleteMany();

    for (chain of chains) {

      // Get rich addresses for every chain
      const richAddressInfoAPI = `https://www.oklink.com/api/v5/explorer/address/rich-list?chainShortName=${chain.chainShortName}`

      const richAddressInfoResponse = await axios.get(richAddressInfoAPI, config)
      const richAddressInfo = richAddressInfoResponse.data.data;

      richAddressInfo.map(async (data) => {
        const newAddress = new RichAddressData(data);
        await newAddress.save();
      })
    }

    console.log(`OkLink ---------- Rich address is successfully updated.`);
  } catch (error) {
    console.log(`OkLink --------- rich address update error:${error}`)
  }
}

module.exports = {
  getRichAddressData,
}