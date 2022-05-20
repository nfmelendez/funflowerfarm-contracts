const TestSupport = require("./test-support");
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const BigNumber = require('bignumber.js');


const FunflowerFarmToken = artifacts.require("FunflowerFarmToken");
const Bank = artifacts.require("Bank");

const TestToken = artifacts.require("TestToken");
const TestBank = artifacts.require("TestBank");

contract("Bank contract", () => {

  const validDeadline = 10000000000000

  contract("Upgrade", accounts  => {

    it("Add another ERC20 token to the game", async () => {

      const fee = web3.utils.toWei("0.1");

      const bank = await Bank.deployed();
      const fffToken = await FunflowerFarmToken.deployed();

      const sessionId = await bank.getSessionId(TestSupport.accounts.TEAM.address, {
        from: TestSupport.accounts.TEAM.address
      })

      const fff = 2

      const signature = await sign(web3, 
        sessionId,
        TestSupport.accounts.TEAM.address,
        fff,
        validDeadline
      );

      await bank.withdraw(signature, sessionId, fff, validDeadline, {from: TestSupport.accounts.TEAM.address, value: fee});

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

  contract("Deposit", accounts  => {

    it("withdraw 2 FFF and deposit again", async () => {
      const fee = web3.utils.toWei("0.1");

      const bank = await Bank.deployed();
      const fffToken = await FunflowerFarmToken.deployed();
      const sessionId = await bank.getSessionId(TestSupport.accounts.PLAYER.address, {
        from: TestSupport.accounts.PLAYER.address
      })

      const fff = 2

      const signature = await sign(web3, 
        sessionId,
        TestSupport.accounts.PLAYER.address,
        fff,
        validDeadline
      );
      
      await bank.withdraw(signature, sessionId, fff, validDeadline, {
        from: TestSupport.accounts.PLAYER.address,
        value: fee
      });

      const fffTokenBalanceBeforeDeposit = await fffToken.balanceOf.call(TestSupport.accounts.PLAYER.address);

      const teamAddressFFFBalanceBeforeDeposit = await fffToken.balanceOf.call(TestSupport.accounts.TEAM.address);

      const sessionIdForDeposit = await bank.getSessionId(TestSupport.accounts.PLAYER.address, {
        from: TestSupport.accounts.PLAYER.address
      })

      const signatureForDeposit = await sign(web3, 
        sessionIdForDeposit,
        TestSupport.accounts.PLAYER.address,
        fff,
        validDeadline
      );

      await bank.deposit(signatureForDeposit, sessionIdForDeposit, fff, validDeadline, {
        from: TestSupport.accounts.PLAYER.address,
      });

      const teamAddressFFFBalance= await fffToken.balanceOf.call(TestSupport.accounts.TEAM.address);
      const fffTokenBalance = await fffToken.balanceOf.call(TestSupport.accounts.PLAYER.address);

      assert.equal(new BigNumber(teamAddressFFFBalanceBeforeDeposit).plus(new BigNumber(fff)).toFixed(), new BigNumber(teamAddressFFFBalance).toFixed());
      assert.equal(new BigNumber(fffTokenBalanceBeforeDeposit).minus(new BigNumber(fff)).toFixed(), new BigNumber(fffTokenBalance).toFixed());

      const hash = encodeSyncFunction(web3, sessionIdForDeposit, TestSupport.accounts.PLAYER.address, fff, validDeadline)
      const isDepositeExecuted = await bank.isTransactionExecuted(hash, {
        from: TestSupport.accounts.PLAYER.address
      })

      assert.equal(true, isDepositeExecuted)

    });

  });

  contract("Withdraw", accounts  => {

    it("withdraw 2 FFF with success", async () => {
      const fee = web3.utils.toWei("0.1");
      const walletBalance = await web3.eth.getBalance(TestSupport.accounts.WITHDRAW_WALLET.address)
      const bank = await Bank.deployed();
      const fffToken = await FunflowerFarmToken.deployed();
      const sessionId = await bank.getSessionId(TestSupport.accounts.PLAYER.address, {
        from: TestSupport.accounts.PLAYER.address
      })

      await bank.transferWithdrawFeeWallet(TestSupport.accounts.WITHDRAW_WALLET.address, {
        from: TestSupport.accounts.TEAM.address
      })

      const fff = 2

      const signature = await sign(web3, 
        sessionId,
        TestSupport.accounts.PLAYER.address,
        fff,
        validDeadline
      );
      

      console.log("Signature " + signature)

      await bank.withdraw(signature, sessionId, fff, validDeadline, {
        from: TestSupport.accounts.PLAYER.address,
        value: fee
      });

      const newSessionId = await bank.getSessionId(TestSupport.accounts.PLAYER.address, {
        from: TestSupport.accounts.PLAYER.address
      })

      const fffTokenBalance = await fffToken.balanceOf.call(TestSupport.accounts.PLAYER.address);
      var actualWalletBalance = await web3.eth.getBalance(TestSupport.accounts.WITHDRAW_WALLET.address)

      assert.equal('2', fffTokenBalance.valueOf().toString(10));
      const expectedBalance = (new BigNumber(walletBalance).plus(new BigNumber(fee))).toFixed()
      assert.equal(expectedBalance, actualWalletBalance);
      assert.notEqual(newSessionId, sessionId);

    });

    it("withdraw with missing fee", async () => {
      const fee = web3.utils.toWei("0.01");
      const bank = await Bank.deployed();
      const sessionId = await bank.getSessionId(TestSupport.accounts.PLAYER.address, {
        from: TestSupport.accounts.PLAYER.address
      })  

      const anySignature = web3.utils.randomHex(32)
      const result = bank.withdraw(anySignature, sessionId, 2, validDeadline, {
        from: TestSupport.accounts.PLAYER.address,
        value: fee
      });

       const e = await result.catch((e) => {
         return e.reason;
        })
        assert.equal("Funflower Farm: Missing fee", e);

    });

    it("withdraw with deadline", async () => {
      const fee = web3.utils.toWei("0.1");
      const bank = await Bank.deployed();
      const sessionId = await bank.getSessionId(TestSupport.accounts.PLAYER.address, {
        from: TestSupport.accounts.PLAYER.address
      })  

      // 10 seconds to late :(
      const deadline = Math.floor(Date.now() / 1000 - 10);
      
      const signature = await sign(web3, 
        sessionId,
        TestSupport.accounts.PLAYER.address,
        fee,
        deadline
      );

      const result = bank.withdraw(signature, sessionId, fee, deadline, {
        from: TestSupport.accounts.PLAYER.address,
        value: fee
      });

       const e = await result.catch((e) => {
         return e.reason;
        })
      assert.equal("Funflower Farm: Deadline Passed", e);

    });

    it("Wrong Session Id", async () => {
      const fee = web3.utils.toWei("0.1");
      const bank = await Bank.deployed();
      const sessionId = await bank.getSessionId(TestSupport.accounts.TEAM.address, {
        from: TestSupport.accounts.PLAYER.address
      })  

      const fff = 2
      const signature = await sign(web3, 
        sessionId,
        TestSupport.accounts.PLAYER.address,
        fff,
        validDeadline,
      );

      const result = bank.withdraw(signature, sessionId, fff, validDeadline, {
        from: TestSupport.accounts.PLAYER.address,
        value: fee
      });

       const e = await result.catch((e) => {
         return e.reason;
        })
        assert.equal("Funflower Farm: Session has changed", e);

    });

    it("Wrong Signature, player attemp to withdraw more than it has", async () => {
      const fee = web3.utils.toWei("0.1");
      const bank = await Bank.deployed();
      const sessionId = await bank.getSessionId(TestSupport.accounts.PLAYER.address, {
        from: TestSupport.accounts.PLAYER.address
      })  

      const fff = 2
      const signature = await sign(web3, 
        sessionId,
        TestSupport.accounts.PLAYER.address,
        fff,
        validDeadline
      );

      const result = bank.withdraw(signature, sessionId, 4, validDeadline, {
        from: TestSupport.accounts.PLAYER.address,
        value: fee
      });

       const e = await result.catch((e) => {
         return e.reason;
        })
        assert.equal("Funflower Farm: Unauthorised", e);

    });

  });

  function encodeSyncFunction(web3, sessionId, addr, fff, deadline) {
    return web3.utils.keccak256(
      web3.eth.abi.encodeParameters(
        [
          "bytes32",
          "address",
          "uint256",
          "uint",
        ],
        [
          sessionId,
          addr,
          fff,
          deadline,
        ]
      )
    );
  }

  async function sign(web3, sessionId, addr, fff, deadline) {
    const sha = encodeSyncFunction(web3, sessionId, addr, fff, deadline);
    const { signature } = await web3.eth.accounts.sign(
      sha,
      TestSupport.accounts.TEAM.privateKey
    );

    return signature;
  }


});
