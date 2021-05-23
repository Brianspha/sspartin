/*global artifacts, contract, it*/
/**/
// For documentation please see https://framework.embarklabs.io/docs/contracts_testing.html
const SpartenUSD = artifacts.require("SpartenUSD");
const SpartenToken = artifacts.require("SpartenToken");
const VFRCoordinatorParentMock = artifacts.require("VFRCoordinatorParentMock");
const StakingContract = artifacts.require("StakingContract");
const bigNumber = require("bignumber.js");
const intialAmount = new bigNumber(6000000 * 10 ** 18).toFixed();
const utils = require("web3-utils");
var hex = "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4";
var fee = 1 * 10 ** 18;
console.log("hex: ", hex, " fee: ", fee);
const convert = require("ether-converter");

let accounts,
  tokenAmount,
  startDate,
  balance,
  endDate,
  deposit,
  streamId,
  keys,
  tokenID,
  decimals;
config(
  {
    contracts: {
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
  },
  (err, accs) => {
    accounts = accs;
  }
);

contract("StakingContract", async () => {
  it("Should transfer all tokens to staking contract", async () => {
    var receipt = await SpartenUSD.methods
      .approve(StakingContract.options.address, intialAmount)
      .send({ gas: 6000000, from: accounts[0] });
     receipt = await SpartenUSD.methods
      .transfer(StakingContract.options.address, intialAmount)
      .send({ gas: 6000000, from: accounts[0] });
    assert.strictEqual(receipt != null, true, "Not transferred");
  });
  it("Should start a new game", async () => {
    console.log("accounts: ", StakingContract.options.address);
    var receipt = await StakingContract.methods
      .createNewGame(Math.round(Math.random() * 100), "https://google.com")
      .send({
        gas: 6000000,
        from: accounts[0],
        value: convert(1, "ether", "wei"),
      });
    console.log("receipt: ", receipt);
    /**/
  });
});
