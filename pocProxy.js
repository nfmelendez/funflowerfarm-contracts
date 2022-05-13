const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const FunflowerFarmToken = artifacts.require("FunflowerFarmToken");
const TestToken = artifacts.require("TestToken");

const Bank = artifacts.require("Bank");
const TestBank = artifacts.require("TestBank");


const delay = ms => new Promise(res => setTimeout(res, ms));

async function deployDelay() {
  await delay(2000);
}


module.exports = async function (deployer, network, accounts) {

  const deployerAddress = accounts[0];
  console.log('Deployer address ' + deployerAddress);


  const fffToken = await FunflowerFarmToken.deployed();

  const bankProxy = await deployProxy(Bank, [], { deployer });
  await bankProxy.setTokens(fffToken.address);
  await fffToken.addGameRole(bankProxy.address);

  const withdrawResult = await bankProxy.withdraw(2884);

  const oldFFFTokenResult = await fffToken.balanceOf(deployerAddress);

  console.log('oldFFFTokenResult ' + oldFFFTokenResult );


  const existingBank = await Bank.deployed();

  await deployer.deploy(TestToken);
  const testTokenAddress = await TestToken.deployed();


  const newProxy = await upgradeProxy(existingBank.address, TestBank, { deployer });
  await newProxy.setTokens(fffToken.address, testTokenAddress.address);

  await testTokenAddress.addGameRole(newProxy.address);
  await fffToken.addGameRole(newProxy.address);

  await newProxy.withdraw(6, 2);

  const fffR = await fffToken.balanceOf(deployerAddress);
  const tttR = await testTokenAddress.balanceOf(deployerAddress);


  console.log(`fffR ${fffR} tttR ${tttR}`);


};
