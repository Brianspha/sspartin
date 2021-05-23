const bigNumber = require("bignumber.js");
const intialAmount = new bigNumber(
  9999900000000000000000000 * 10 ** 18
).toFixed();
console.log("initialAmount: ", intialAmount);
require("dotenv").config();
console.log("process.env: ", process.env.GAME_KEY);
const utils = require("web3-utils");
var hex = utils.toHex("asdada;lsdkl;askdl;askdasd");
var fee = 1 * 10 ** 18;
console.log("hex: ", hex, " fee: ", fee);
module.exports = {
  // default applies to all environments
  default: {
    library: "embarkjs", // can also be 'web3'

    // order of connections the dapp should connect to
    dappConnection: ["$WEB3"],

    // Automatically call `ethereum.enable` if true.
    // If false, the following code must run before sending any transaction: `await EmbarkJS.enableEthereum();`
    // Default value is true.
    // dappAutoEnable: true,

    gas: "auto",

    // Strategy for the deployment of the contracts:
    // - implicit will try to deploy all the contracts located inside the contracts directory
    //            or the directory configured for the location of the contracts. This is default one
    //            when not specified
    // - explicit will only attempt to deploy the contracts that are explicitly specified inside the
    //            contracts section.
    // strategy: 'implicit',

    // minimalContractSize, when set to true, tells Embark to generate contract files without the heavy bytecodes
    // Using filteredFields lets you customize which field you want to filter out of the contract file (requires minimalContractSize: true)
    // minimalContractSize: false,
    // filteredFields: [],
    strategy: "explicit",
    deploy: {},
  },
  development: {
    gas: "6000000",
    strategy: "explicit",
    deploy: {
      SpartenUSD: {
        args: ["SSPartenToken", "ST", 18, intialAmount],
      },
      SpartenToken: {
        args: ["SSpartenToken", "ST"],
      },
      VFRCoordinatorParentMock: {
        //   deps: ["SpartenUSD"],
        args: ["$SpartenUSD", hex.toString(), new bigNumber(fee).toFixed(0)],
      },
      StakingContract: {
        deps: ["SpartenToken", "VFRCoordinatorParentMock", "SpartenUSD"],
        args: [
          "$SpartenToken",
          "$VFRCoordinatorParentMock",
          "$SpartenUSD",
          hex,
        ],
      },
    },
    afterDeploy: async ({ contracts, web3, logger }) => {
      console.log("deployed contracts: ", web3.eth.defaultAccount);
      var receipt = await contracts.SpartenUSD.methods
        .transferFrom(
          web3.eth.defaultAccount,
          contracts.StakingContract.options.address,
          intialAmount
        )
        .send({ gas: 6000000, from: web3.eth.defaultAccount });
      console.log("receipt: ", receipt);
    },
  },
  matic: {
    gas: "6000000",
    strategy: "explicit",
    deploy: {
      SpartenUSD: {
        args: ["SSParinToken", "ST", 18, intialAmount],
      },
      CTokenManager: {
        args: [],
      },
    },
  },

  // default environment, merges with the settings in default
  // assumed to be the intended environment by `embark run`

  // you can name an environment with specific settings and then specify with
  // "embark run custom_name" or "embark blockchain custom_name"
  // custom_name: {}
};
