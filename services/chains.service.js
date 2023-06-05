const axios = require('axios');
const ChainData = require('../models/chains')
const cron = require("node-cron");

// OkLink ------------------ get chains information

const getChainData = async () => {

  const config = {
    headers: {
      "Ok-Access-Key": process.env.OKLINK_API_KEY,
    }
  }

  const chainListAPI = 'https://www.oklink.com/api/v5/explorer/blockchain/summary'

  try {
    const response = await axios.get(chainListAPI, config);
    
    const chains = response.data.data;

    // Keep track of updated or created chain entries
    // const updatedChainFullNames = [];

    for (const chain of chains) {
      const chainFullName = chain.chainFullName;

      await ChainData.updateOne(
        { chainFullName: chainFullName },
        { $set: chain },
        { upsert: true }
      );

      // Add chainFullName to the updated list
      // updatedChainFullNames.push(chainFullName);

      // Fetch chain details and save to database
      const chainBlockInfoAPI = `https://www.oklink.com/api/v5/explorer/blockchain/info?chainShortName=${chain.chainShortName}`;
      const chainAddressInfoAPI = `https://www.oklink.com/api/v5/explorer/blockchain/address?chainShortName=${chain.chainShortName}`
      const chainBlockBasicInfoAPI = `https://www.oklink.com/api/v5/explorer/blockchain/block?chainShortName=${chain.chainShortName}`
      const chainFeeInfoAPI = `https://www.oklink.com/api/v5/explorer/blockchain/fee?chainShortName=${chain.chainShortName}`
      const chainHashInfoAPI = `https://www.oklink.com/api/v5/explorer/blockchain/hashes?chainShortName=${chain.chainShortName}`
      const chainMineInfoAPI = `https://www.oklink.com/api/v5/explorer/blockchain/mine?chainShortName=${chain.chainShortName}`
      const chainTransactionInfoAPI = `https://www.oklink.com/api/v5/explorer/blockchain/transaction?chainShortName=${chain.chainShortName}`

      try {
        const [
          chainBlockInfoResponse,
          chainAddressInfoResponse,
          chainBlockBasicInfoResponse,
          chainFeeInfoResponse,
          chainHashInfoResponse,
          chainMineInfoResponse,
          chainTransactionInfoResponse
        ] = await Promise.all([
          axios.get(chainBlockInfoAPI, config),
          axios.get(chainAddressInfoAPI, config),
          axios.get(chainBlockBasicInfoAPI, config),
          axios.get(chainFeeInfoAPI, config),
          axios.get(chainHashInfoAPI, config),
          axios.get(chainMineInfoAPI, config),
          axios.get(chainTransactionInfoAPI, config)
        ]);

        const chainBlockInfo = chainBlockInfoResponse.data.data[0];
        const chainAddressInfo = chainAddressInfoResponse.data.data[0];
        const chainBlockBasicInfo = chainBlockBasicInfoResponse.data.data[0];
        const chainFeeInfo = chainFeeInfoResponse.data.data[0];
        const chainHashInfo = chainHashInfoResponse.data.data[0];
        const chainMineInfo = chainMineInfoResponse.data.data[0];
        const chainTransactionInfo = chainTransactionInfoResponse.data.data[0];

        let updatedInfo = {
          ...chainBlockInfo,
          ...chainAddressInfo,
          ...chainBlockBasicInfo,
          ...chainFeeInfo,
          ...chainHashInfo,
          ...chainMineInfo,
          ...chainTransactionInfo,
        }
        // Save chainInfo to the database
        // Assuming your ChainData schema has a chainInfo field to store the data
        await ChainData.updateOne({ chainFullName: chainFullName }, { $set: updatedInfo });
      } catch (err) {
        console.log(`OkLink --------- Fetching Chain Info error: ${err}`);
      }
    }

    // Set active field to false for chains not present in the current API response
    // await ChainData.updateMany({ chainFullName: { $nin: updatedChainFullNames } }, { $set: { existing: false } });
    console.log(
      `OkLink --------- Chain Information Successfully Updated.`
    );
  } catch (err) {
    console.log(`OkLink --------- Updating Chain Data error: ${err}`)
  }
}

module.exports = {
  getChainData,
}