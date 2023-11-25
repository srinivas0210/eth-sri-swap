pragma solidity >=0.4.21 <0.6.0;

import "./SriToken.sol";

contract EthSriSwap {
    string public name = "Eth Sri Swap";
    SriToken public token;

    event BuyTokensEvent(address receiver, uint value);

    constructor(address _address) public {
        token = SriToken(_address);
    }

    function buyTokens() public payable {
        uint value = 100 * msg.value; // no of sri tokens

        require(value <= token.balanceOf(address(this)), "No enough funds");

        token.transfer(msg.sender, value);

        emit BuyTokensEvent(msg.sender, value);
    }

    function sellTokens(uint sriTokens) public {
        require(token.balanceOf(msg.sender) >= sriTokens, "No enough funds");

        uint noOfEther = sriTokens / 100; // no of ether tokens

        require(address(this).balance >= noOfEther, "Contract have no funds");

        token.transferFrom(msg.sender, address(this), sriTokens);

        msg.sender.transfer(noOfEther);
    }
}
