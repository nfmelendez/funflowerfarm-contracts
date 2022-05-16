const TestSupport = require("./test-support");
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');


const FunflowerFarmToken = artifacts.require("FunflowerFarmToken");
const Bank = artifacts.require("Bank");

const TestToken = artifacts.require("TestToken");
const TestBank = artifacts.require("TestBank");

contract("Bank contract", () => {

  contract("Upgrade", accounts  => {

    it("Add another ERC20 token to the game", async () => {

      const bank = await Bank.deployed();
      const fffToken = await FunflowerFarmToken.deployed();

      await bank.withdraw(2, {from: TestSupport.accounts.TEAM.address});

      const fffTokenBalance = await fffToken.balanceOf.call(TestSupport.accounts.TEAM.address);
      assert.equal(fffTokenBalance.valueOf().toString(10), '500000000000000000000002');

    
      const testTokenAddress = await TestToken.deployed();
    
    
      const newProxy = await upgradeProxy(bank.address, TestBank);
      await newProxy.setTokens(fffToken.address, testTokenAddress.address);
    
      await testTokenAddress.addGameRole(newProxy.address);
      await fffToken.addGameRole(newProxy.address);
    
      await newProxy.withdraw(6, 2);
    
      const fffR = await fffToken.balanceOf(TestSupport.accounts.TEAM.address);
      const tttR = await testTokenAddress.balanceOf(TestSupport.accounts.TEAM.address);
      assert.equal(fffR.valueOf().toString(10), '500000000000000000000008');
      assert.equal(tttR.valueOf().toString(10), '500000000000000000000002');

    });

  });

  contract("Withdraw", accounts  => {

    it("withdraw 2 FFF with success", async () => {

      const bank = await Bank.deployed();
      const fffToken = await FunflowerFarmToken.deployed();

      await bank.withdraw(2, {from: TestSupport.accounts.TEAM.address});

      const fffTokenBalance = await fffToken.balanceOf.call(TestSupport.accounts.TEAM.address);
      assert.equal(fffTokenBalance.valueOf().toString(10), '500000000000000000000002');

    });

  });
});
