import Web3 from "web3";
import { toWei } from "web3-utils";
import { deploySFLContracts, gasLimit, TestAccount } from "./test-support";

describe("FFF Token contract", () => {

  describe("Minting", () => {

    it("team initial mint of FFF", async () => {
      const web3 = new Web3(
        new Web3.providers.HttpProvider(process.env.ETH_NETWORK)
      );
      const { fffToken } = await deploySFLContracts(web3);

      const fffTokenBalance = await fffToken.methods.balanceOf(TestAccount.TEAM.address).call({ from: TestAccount.TEAM.address });
      expect(Number(fffTokenBalance)).toEqual(500000*10**18);
    });

    it("mint 500000 FFF", async () => {
        const web3 = new Web3(
          new Web3.providers.HttpProvider(process.env.ETH_NETWORK)
        );
        const { fffToken } = await deploySFLContracts(web3);

        await fffToken.methods.gameMint(TestAccount.PLAYER.address, 500000).send({
            from: TestAccount.TEAM.address,
            gasPrice: await web3.eth.getGasPrice(),
            gas: gasLimit,
        });

        const fffTokenBalance = await fffToken.methods.balanceOf(TestAccount.PLAYER.address).call({ from: TestAccount.PLAYER.address });
        expect(fffTokenBalance).toEqual("500000");
      });

      it("Player will try to pause contract and get an error", async () => {
        const web3 = new Web3(
          new Web3.providers.HttpProvider(process.env.ETH_NETWORK)
        );
        const { fffToken } = await deploySFLContracts(web3);

        const result = fffToken.methods.pause().send({
            from: TestAccount.PLAYER.address,
            gasPrice: await web3.eth.getGasPrice(),
            gas: gasLimit,
        });

       await expect(
          result.catch((e: Error) => Promise.reject(e.message))
        ).rejects.toContain("Funflower Farm: You are not the game");

      });

      it("Try to mint 1 FFF with the contract paused", async () => {
        const web3 = new Web3(
          new Web3.providers.HttpProvider(process.env.ETH_NETWORK)
        );
        const { fffToken } = await deploySFLContracts(web3);

        await fffToken.methods.pause().send({
            from: TestAccount.TEAM.address,
            gasPrice: await web3.eth.getGasPrice(),
            gas: gasLimit,
        });

       const result = fffToken.methods.gameMint(TestAccount.PLAYER.address, 1).send({
          from: TestAccount.TEAM.address,
          gasPrice: await web3.eth.getGasPrice(),
          gas: gasLimit,
      });

       await expect(
          result.catch((e: Error) => Promise.reject(e.message))
        ).rejects.toContain("Pausable: paused");

        await fffToken.methods.unPause().send({
          from: TestAccount.TEAM.address,
          gasPrice: await web3.eth.getGasPrice(),
          gas: gasLimit,
      });

      await fffToken.methods.gameMint(TestAccount.PLAYER.address, 1).send({
        from: TestAccount.TEAM.address,
        gasPrice: await web3.eth.getGasPrice(),
        gas: gasLimit,
      });

      const fffTokenBalance = await fffToken.methods.balanceOf(TestAccount.PLAYER.address).call({ from: TestAccount.PLAYER.address });
      expect(fffTokenBalance).toEqual("1");

    });

  });
});
