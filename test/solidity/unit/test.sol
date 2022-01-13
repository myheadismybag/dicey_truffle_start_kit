// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../../../contracts/DiceRoller.sol";

contract TestDiceRoller {

  DiceRoller public diceRoller;

  // Run before every test function
  function beforeEach() public {
    bytes32 keyhash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
    uint fee = 1000000000000000000;
    address link = 0xa36085F69e2889c224210F603D836748e7dC0088;
    address KOVAN_VRF_COORDINATOR = 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9;

    diceRoller = new DiceRoller(
      KOVAN_VRF_COORDINATOR,
      link,
      keyhash,
      fee
    );
  }

  function testgetAllUsersCount1() public {
    uint result = diceRoller.getAllUsersCount();
    Assert.equal(result, 0, "It should be 0 if no one has rolled.");
  }
}