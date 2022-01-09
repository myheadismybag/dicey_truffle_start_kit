const { expect, assert } = require('chai');



// Start test block
contract('DiceRoller', accounts => {
  // const DiceRoller = artifacts.require('DiceRoller')
    const DiceRoller = artifacts.require('DiceRoller')
    const VRFCoordinatorMock = artifacts.require('VRFCoordinatorMock')
    const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
    const defaultAccount = accounts[0]
    let randomNumberConsumer, vrfCoordinatorMock, link, keyhash, fee

  let diceRoller;
  const addr1 = accounts[0]
  const addr2 = accounts[1]
  const stranger = accounts[2]
  const consumer = accounts[3]

  console.log('aaaa: ' + JSON.stringifyaddr1)
  console.log('aaaa: ' + addr2)

  beforeEach(async () => {
      LinkToken.setProvider(web3.currentProvider)
      // Oracle.setProvider(web3.currentProvider)

      keyhash = '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4'
      fee = '1000000000000000000'
      link = await LinkToken.new({ from: defaultAccount })
      vrfCoordinatorMock = await VRFCoordinatorMock.new(link.address, { from: defaultAccount })
      // diceRoller = await DiceRoller.new(link.address, keyhash, vrfCoordinatorMock.address, fee, { from: defaultAccount })
      diceRoller = await DiceRoller.new(vrfCoordinatorMock.address, link.address, keyhash, fee, { from: defaultAccount })
        // constructor(address _vrfCoordinator, address _link, bytes32 _keyHash, uint256 _fee) public

      console.log('Contract Address: ' + diceRoller.address);

  })
  // beforeEach(async() => {
  //   // diceRoller = await DiceRoller.new();
  //   // diceRoller = await DiceRoller.new("0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
  //   // "0xa36085F69e2889c224210F603D836748e7dC0088",
  //   // "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
  //   // "100000000000000000");
  //   // await diceRoller.deployed();
  //       const KOVAN_KEYHASH = '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4'
  //       const KOVAN_FEE = '100000000000000000'
  //       const KOVAN_LINK_TOKEN = '0xa36085F69e2889c224210F603D836748e7dC0088'
  //       const KOVAN_VRF_COORDINATOR = '0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9'
  //       deployer.deploy(DiceRoller, KOVAN_LINK_TOKEN, KOVAN_KEYHASH, KOVAN_VRF_COORDINATOR, KOVAN_FEE)
  //       randomNumberConsumer = await RandomNumberConsumer.new(link.address, keyhash, vrfCoordinatorMock.address, fee, { from: defaultAccount })

    
  //   //diceRoller = await DiceRoller.attach("0x148fCAfca00Ee3fFFf96ae01F9c9C91C8824CD36"); // 0xCE0B6Dfe0B74c66853E931519068892eA0C48f41

  //   console.log('Contract Address: ' + diceRoller);
  // });

  // Test case
  it('will return false from hasRolledOnce when an address has not rolled yet.', async function() {
    const hasRolled = await diceRoller.hasRolledOnce( addr1 );
    assert.equal(hasRolled, false, "Unrolled address should return false");
    // expect(hasRolled).to.equal(false);
  });

  it('will return true from hasRolledBefore when an address has called hasRolled.', async function() {
    try {
      console.log('1.')
      let hasRolled;

      console.log('2.')
      const numberOfDie = 4;
      const dieSize = 10;
      const adjustment = 0;
      const result = 13;
      let tx = await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);
      // await tx.wait();

      console.log('3.')
      tx = await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);
      // await tx.wait();

      hasRolled = await diceRoller.hasRolledBefore( addr1 );
      assert.equal(hasRolled, true, "Address should return true");
      // expect(hasRolled).to.equal(true);

      // Rolling again will not change the result
      console.log('4.')
      tx = await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);
      // await tx.wait();

      console.log('5.')
      hasRolled = await diceRoller.hasRolledBefore( addr1 );
      assert.equal(hasRolled, true, "Address should return true");
      // expect(hasRolled).to.equal(true);
    }
    catch(err){
      console.log('error: ' + err.stack)
    }
  });

  it('will return true from hasRolledBefore when an address has called hasRolled.', async function() {
    try {
      console.log('1.')
      let hasRolled;

      // let hasRolled = await diceRoller.hasRolledOnce( addr1 );
      hasRolled = await diceRoller.hasRolledBefore( addr1 );
      expect(hasRolled).to.equal(false);

      console.log('2.')
      const numberOfDie = 4;
      const dieSize = 10;
      const adjustment = 0;
      const result = 13;
      let tx = await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);
      // await tx.wait();

      console.log('3.')
      // hasRolled = await diceRoller.hasRolledBefore( addr1 );
      // // assert.equal(hasRolled, true, "Address should return true");
      // expect(hasRolled).to.equal(true);

      // Rolling again will not change the result
      console.log('4.')
      tx = await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);
      // await tx.wait();

      console.log('5.')
      hasRolled = await diceRoller.hasRolledBefore( addr1 );
      expect(hasRolled).to.equal(true);
    }
    catch(err){
      console.log('error: ' + err.stack)
    }
  });

  it('will return true from hasRolledOnce when an address has called hasRolled.', async function() {
    let hasRolled = await diceRoller.hasRolledOnce( addr1 );
    // assert.equal(hasRolled, false, "Address should return true");
    expect(hasRolled).to.equal(false);

    const numberOfDie = 4;
    const dieSize = 10;
    const adjustment = 0;
    const result = 13;
    let tx = await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);
    // await tx.wait();
    hasRolled = await diceRoller.hasRolledOnce( addr1 );
    // assert.equal(hasRolled, true, "Address should return true");
    expect(hasRolled).to.equal(true);

    // Rolling again will not change the result
    tx = await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);
    // await tx.wait();
    hasRolled = await diceRoller.hasRolledOnce( addr1 );
    // assert.equal(hasRolled, true, "Address should return true");
    expect(hasRolled).to.equal(true);
  });

  it('will return 0 from getUserRollsCount when an address has not rolled yet.', async function() {
    let userRollCount = await diceRoller.getUserRollsCount(addr1)
    // assert.equal(userRollCount, 0, "getUserRollsCount should be 0");
    expect(userRollCount.toNumber()).to.equal(0);
  });

  it('will increment the value from getUserRollsCount when an address has called hasRolled.', async function() {

    let userRollCount = await diceRoller.getUserRollsCount(addr1)
    // assert.equal(userRollCount, 0, "getUserRollsCount should be 0");
    expect(userRollCount.toNumber()).to.equal(0);

    const numberOfDie = 4;
    const dieSize = 10;
    const adjustment = 0;
    const result = 13;
    let tx = await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);
    // await tx.wait();
    try {
    userRollCount = await diceRoller.getUserRollsCount(addr1)
    //console.log('userRollCount: ' + userRollCount);
    // assert.equal(userRollCount, 1, "getUserRollsCount should be 1");
    expect(userRollCount.toNumber()).to.equal(1);

    // Rolling again will not change the result
    tx = await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);
    // await tx.wait();

    expect((await diceRoller.getUserRollsCount(addr1)).toNumber()).to.equal(2);

    // If I use userRollCount here, it will throw an exception on kovan.
    userRollCount = await diceRoller.getUserRollsCount(addr1)
    console.log('tttt: ' + (userRollCount.toNumber()))
    // console.log('userRollCount: ' + userRollCount);
    // assert.equal(userRollCount, 2, "getUserRollsCount should be 2");
    expect(userRollCount.toNumber()).to.equal(2);
  }
  catch(err){console.log('FFF: ' + err.stack)}
  });

  it('will fail if too many dice are used.', async function() {
    const numberOfDie = 14;
    const dieSize = 10;
    const adjustment = 0;
    const result = 13;

    try {
      await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);
      assert.fail();
    }
    catch(err) {
      // console.log('err: ' + err)
      assert.isOk('failed','as expected')
    }
  });


  it('will fail if too dice size is > 100.', async function() {
    const numberOfDie = 10;
    const dieSize = 101;
    const adjustment = 0;
    const result = 13;
    try {
      await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);
      assert.fail();
    }
    catch(err) {
      // console.log('err: ' + err)
      assert.isOk('failed','as expected')
    }  
  });


  it('will fail if too large an adjustment is used.', async function() {
    const numberOfDie = 10;
    const dieSize = 100;
    const adjustment = 21;
    const result = 13;
    try {
      await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);
      assert.fail();
    }
    catch(err) {
      // console.log('err: ' + err)
      assert.isOk('failed','as expected')
    }
  });  

  it('will fail if too small an adjustment is used.', async function() {
    const numberOfDie = 10;
    const dieSize = 100;
    const adjustment = -21;
    const result = 13;
    try {
      await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);
      assert.fail();
    }
    catch(err) {
      // console.log('err: ' + err)
      assert.isOk('failed','as expected')
    }
  });

  it('will add roller to data structures.', async function() {
    try {
      const numberOfDie = 10;
      const dieSize = 11;
      const adjustment = -1;
      let tx = await diceRoller.rollDiceFast(numberOfDie, dieSize, adjustment);
      // console.log(tx)

      let hasRolled = await diceRoller.hasRolledOnce( addr1 );
      assert.equal(hasRolled, true, "Address should return true");

      let userRolls = await diceRoller.getUserRolls(addr1)
      // console.log('userRolls: ' + userRolls);
      assert.equal(userRolls.length, 1, "getUserRolls should be 1");

      /*
    struct DiceRollee {
        address rollee;
        uint timestamp; /// When the die were rolled
        uint256 randomness; /// Stored to help verify/debug results
        uint8 numberOfDie; /// 1 = roll once, 4 = roll four die
        uint8 dieSize; // 6 = 6 sided die, 20 = 20 sided die
        int8 adjustment; /// Can be a positive or negative value
        int16 result; /// Result of all die rolls and adjustment. Can be negative because of a negative adjustment.
        /// Max value can be 1000 (10 * 100 sided die rolled)
        bool hasRolled; /// Used in some logic tests
        uint8[] rolledValues; /// array of individual rolls. These can only be positive.
      }
      */
      assert.equal(userRolls[0][0], addr1, "Number of rolls for user should be 1");
      assert.equal(userRolls[0][3], numberOfDie, "number of dice do not match");
      assert.equal(userRolls[0][4], dieSize, "die size do not match");
      assert.equal(userRolls[0][5], adjustment, "adjustments do not match");
      assert.equal(userRolls[0][7], true, "hasRolled flag should be true");

    }
    catch(err){
      console.log(err.message)
      assert.fail(null, null, 'Should not fail.')
    }
  });

  it('will emit events when rollDiceFast is called.', async function() {
    try {
      const numberOfDie = 10;
      const dieSize = 10;
      const adjustment = 0;
      let tx = await diceRoller.rollDiceFast(numberOfDie, dieSize, adjustment);
      console.log(tx.logs)
      // let tx = await tx1.wait()
      // console.log('e1: ' + JSON.stringify(tx.events[0]))
      // console.log('e2: ' + JSON.stringify(tx.events[1]))
      const event1 = tx.logs[0].event;
      const event2 = tx.logs[1].event;

      // works too but cant get args
      // await expect(diceRoller.rollDiceFast(numberOfDie, dieSize, adjustment))
      //   .to.emit(diceRoller, 'DiceRolled')
      //     .withArgs(requestId, roller)
      //   .to.emit(diceRoller, 'DiceLanded')

      // two events should be fired
      // assert.equal(tx.events.length, 2, "two event should have fired");

      assert.equal(event1, "DiceRolled", "DiceRolled is expected to be first event");
      assert.equal(event2, "DiceLanded", "DiceLanded is expected to be second event");

      // validate event args fir DiceRolled event
      // event DiceRolled(bytes32 indexed requestId, address indexed roller);
      // let args = event1.args;
      // assert.isOk(args.requestId > 0, "requestId is expected to be populated");
      // assert.equal(args.roller, addr1, "roller address is expected to match the user's address");
 
      // validate DiceLanded event data
      /*
      event DiceLanded(
        bytes32 indexed requestId, 
        address indexed roller, 
        uint8[] rolledvalues, 
        int8 adjustment, 
        int16 result
        );
      // */  
      // args = event2.args;
      // assert.isOk(args.requestId > 0, "requestId is expected to be populated");
      // assert.equal(args.roller, addr1, "roller address is expected to match the user's address");
      // assert.equal(args.rolledvalues.length, numberOfDie, "rolledvalues length should match number of dice");
      // assert.equal(args.adjustment, adjustment, "adjustment should match adjustment passed in");
    }
    catch(err){
      console.log('Error: ' + err.message)
      assert.fail(null, null, 'Should not fail.')
    }
  }); 

  it('will return an array from getUserRolls for all rolls by an address.', async function() {
    // console.log('Contract address: ' + diceRoller);
    let userRolls = await diceRoller.getUserRolls(addr1)
    assert.equal(userRolls.length, 0, "getUserRolls should be 0");
  });


  it('will return an array from getUserRolls for all rolls by an address when they roll.', async function() {
    let totalUsers = await diceRoller.getAllUsersCount()
    assert.equal(totalUsers.toNumber(), 0, "totalUsers should be 0");

    let hasRolled = await diceRoller.hasRolledOnce( addr1 );
    assert.equal(hasRolled, false, "Address should return false");

    hasRolled = await diceRoller.hasRolledOnce( addr1 );
    assert.equal(hasRolled, false, "Address should return false");

    const numberOfDie = 4;
    const dieSize = 10;
    const adjustment = 0;
    const result = 13;
    // let tx = await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);
    await diceRoller.rollDiceFast(numberOfDie, dieSize, adjustment);

    hasRolled = await diceRoller.hasRolledOnce( addr1 );
    assert.equal(hasRolled, true, "Address should return true");

    totalUsers = await diceRoller.getAllUsersCount()
    assert.equal(totalUsers.toNumber(), 1, "totalUsers should be 1");

    let userRolls = await diceRoller.getUserRolls(addr1)
    assert.equal(userRolls.length, 1, "getUserRolls should be 1");

    await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);

    userRolls = await diceRoller.getUserRolls(addr1)
    assert.equal(userRolls.length, 2, "getUserRolls should be 2");

    totalUsers = await diceRoller.getAllUsersCount()
    assert.equal(totalUsers.toNumber(), 1, "totalUsers should be 1");

    userRolls = await diceRoller.getUserRolls(addr2)
    assert.equal(userRolls.length, 0, "getUserRolls should be 0 for address 2");

    await diceRoller.rollDiceFast(numberOfDie, dieSize, adjustment, {from: addr2});

    userRolls = await diceRoller.getUserRolls(addr2)
    assert.equal(userRolls.length, 1, "getUserRolls should be 1 for address 2");

    totalUsers = await diceRoller.getAllUsersCount()
    assert.equal(totalUsers.toNumber(), 2, "totalUsers should be 2");

  });
  
 
  it('will return an array from getUserRolls for all rolls by an address when they roll.', async function() {
    let totalUsers = await diceRoller.getAllUsersCount()
    assert.equal(totalUsers.toNumber(), 0, "totalUsers should be 0");

    let hasRolled = await diceRoller.hasRolledOnce( addr1 );
    assert.equal(hasRolled, false, "Address should return false");

    hasRolled = await diceRoller.hasRolledOnce( addr1 );
    assert.equal(hasRolled, false, "Address should return false");

    const numberOfDie = 4;
    const dieSize = 10;
    const adjustment = 0;
    const result = 13;
    // let tx = await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);
    let tx = await diceRoller.rollDiceFast(numberOfDie, dieSize, adjustment);

    hasRolled = await diceRoller.hasRolledOnce( addr1 );
    assert.equal(hasRolled, true, "Address should return true");

    totalUsers = await diceRoller.getAllUsersCount()
    assert.equal(totalUsers.toNumber(), 1, "totalUsers should be 1");

    let userRolls = await diceRoller.getUserRolls(addr1)
    // console.log('userRolls: ' + userRolls);
    assert.equal(userRolls.length, 1, "getUserRolls should be 1");

    await diceRoller.hasRolled(numberOfDie, dieSize, adjustment, result);

    userRolls = await diceRoller.getUserRolls(addr1)
    //console.log('userRolls: ' + userRolls);
    assert.equal(userRolls.length, 2, "getUserRolls should be 2");

    // userRolls = await diceRoller.getUserRolls(addr2)
    // console.log('userRolls: ' + userRolls);
    // assert.equal(userRolls.length, 0, "getUserRolls should be 0 for address 2");
  });
 
});

// used to convert data returned from a solidity event to a javascript object
function diceRolleeArrayToJSON(diceRolleeArray) {
  let values = [];
  diceRolleeArray.forEach(element => {
    const [address, timestamp, randomness, numberOfDie, dieSize, adjustment, result, hasRolled, rolledValues] = element;
    values.push({ 
       address,
       timestamp,
       randomness,
       numberOfDie,
       dieSize,
       adjustment,
       result,
       hasRolled,
       rolledValues
    });
  })

  return values;
}
