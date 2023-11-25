const SriToken = artifacts.require("SriToken");
const EthSriSwap = artifacts.require("EthSriSwap");

module.exports = async function(deployer) {
  const user = "0x1F1A65DA05A40606cbc850C9a3D64F64e17859A9";
  await deployer.deploy(SriToken);
  const sriToken = await SriToken.deployed();

  await deployer.deploy(EthSriSwap, sriToken.address);

  const ethSriSwap = await EthSriSwap.deployed();

  await sriToken.transfer(
    ethSriSwap.address,
    web3.utils.toWei("1000000", "ether")
  );

  await ethSriSwap.buyTokens({
    value: web3.utils.toWei("2", "ether"),
  });

  const accountBalanceBrought = await sriToken.balanceOf(user);
  const contractBalanceBrought = await sriToken.balanceOf(ethSriSwap.address);
  const etherBalanceOnContractBrought = await web3.eth.getBalance(
    ethSriSwap.address
  );

  await sriToken.approve(
    ethSriSwap.address,
    web3.utils.toWei("1000", "ether"),
    {
      from: user,
    }
  );

  await ethSriSwap.sellTokens(web3.utils.toWei("100", "ether"), {
    from: user,
  });

  const accountBalanceSold = await sriToken.balanceOf(user);
  const contractBalanceSold = await sriToken.balanceOf(ethSriSwap.address);
  const etherBalanceOnContractSold = await web3.eth.getBalance(
    ethSriSwap.address
  );

  console.log(
    "brought",
    accountBalanceBrought.toString(),
    contractBalanceBrought.toString(),
    etherBalanceOnContractBrought.toString() // 2 ether
  );

  console.log(
    "sold",
    accountBalanceSold.toString(),
    contractBalanceSold.toString(),
    etherBalanceOnContractSold.toString() // 1 ether
  );
};
