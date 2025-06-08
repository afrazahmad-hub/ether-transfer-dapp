// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TransferEther {
    event EtherSent(address indexed from, address indexed to, uint256 amount, uint256 timestamp);

    // Fallback to receive Ether
    receive() external payable {}

    // Send Ether to another address
    function sendEther(address payable _to) public payable {
        require(msg.value > 0, "Must send some ether");
        require(_to != address(0), "Invalid address");

        (bool sent, ) = _to.call{value: msg.value}("");
        require(sent, "Ether transfer failed");

        emit EtherSent(msg.sender, _to, msg.value, block.timestamp);
    }

    // Check contract balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}