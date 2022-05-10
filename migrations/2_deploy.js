const FunflowerFarmToken = artifacts.require("FunflowerFarmToken");

const delay = ms => new Promise(res => setTimeout(res, ms));

async function deployDelay() {
  await delay(2000);
}


module.exports = async function (deployer) {
  //Deploy FunflowerFarmToken
  await deployer.deploy(FunflowerFarmToken);
  await deployDelay();
  await deployDelay()
  console.log('Finish');
};
