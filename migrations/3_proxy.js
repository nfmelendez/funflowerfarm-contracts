const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const FunflowerFarmToken = artifacts.require("FunflowerFarmToken");
const TestToken = artifacts.require("TestToken");

const Bank = artifacts.require("Bank");

const delay = ms => new Promise(res => setTimeout(res, ms));

async function deployDelay() {
  await delay(2000);
}


module.exports = async function (deployer, network, accounts) {

  const deployerAddress = accounts[0];
  console.log('Deployer address ' + deployerAddress + "network " + network);
  const fffToken = await FunflowerFarmToken.deployed();
  const bankProxy = await deployProxy(Bank, [], { deployer });
  await bankProxy.setTokens(fffToken.address);
  await fffToken.addGameRole(bankProxy.address);

  if (network === 'development') {
    await deployer.deploy(TestToken);
  }

  console.log(`const contractAddress = {"bank" : "${bankProxy.address}", "fffToken" : "${fffToken.address}" \n}`)

};
