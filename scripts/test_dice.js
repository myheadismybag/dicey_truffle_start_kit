async function main () {
try {
  // We get the contract to deploy
  const accounts = await ethers.provider.listAccounts();
  console.log('Accounts: ' + accounts);
  const [deployer, addr1] = await hre.ethers.getSigners();

  const Box = await ethers.getContractFactory('DiceRoller');

  let balance = await ethers.provider.getBalance(deployer.address)
  console.log('Balance: ' + ethers.utils.formatEther(balance))

  console.log('Deploying Box...');
  // const box = await Box.deploy(); // 0xdE2d4d2ac71f825Cd655F9fA4B96286578848CE7
  // const box = await Box.attach("0x148fCAfca00Ee3fFFf96ae01F9c9C91C8824CD36"); // 0xCE0B6Dfe0B74c66853E931519068892eA0C48f41
   const box = await Box.deploy("0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
    "0xa36085F69e2889c224210F603D836748e7dC0088",
    "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
    "100000000000000000");

  await box.deployed();
  console.log('Box deployed to:', box.address);
  
  // balance = await ethers.provider.getBalance(deployer.address)
  // console.log('Balance: ' + ethers.utils.formatEther(balance))

  // let txn = await box.store(43);
  // await txn.wait()
  
  // const v = await box.retrieve();
  // console.log('v: ' + v.toString())


  balance = await ethers.provider.getBalance(deployer.address)
  console.log('Balance: ' + ethers.utils.formatEther(balance))

  let hasRolled = await box.hasRolledBefore( deployer.address );
  console.log('hasRolled 1: ' + hasRolled);

  balance = await ethers.provider.getBalance(deployer.address)
  console.log('Balance: ' + ethers.utils.formatEther(balance))

  const numberOfDie = 4;
  const dieSize = 10;
  const adjustment = 0;
  const result = 13;
  let tx = await box.hasRolled(numberOfDie, dieSize, adjustment, result);
  await tx.wait();
  console.log('tx1: ' + JSON.stringify(tx))

  tx = await box.hasRolled(numberOfDie, dieSize, adjustment, result);
  await tx.wait();
  console.log('tx2: ' + JSON.stringify(tx))

/*
  balance = await ethers.provider.getBalance(deployer.address)
  console.log('Balance: ' + ethers.utils.formatEther(balance))

  hasRolled = await box.hasRolledBefore( deployer.address );
  console.log('hasRolled 2: ' + hasRolled);

  tx = await box.hasRolled(numberOfDie, dieSize, adjustment, result);
  await tx.wait();
  console.log('tx2: ' + JSON.stringify(tx))

  balance = await ethers.provider.getBalance(deployer.address)
  console.log('Balance: ' + ethers.utils.formatEther(balance))


  hasRolled = await box.hasRolledBefore( deployer.address );
  console.log('hasRolled 3: ' + hasRolled);

  hasRolled = await box.hasRolledOnce( deployer.address );
  console.log('hasRolled 4: ' + hasRolled);  


  balance = await ethers.provider.getBalance(deployer.address)
  console.log('Balance: ' + ethers.utils.formatEther(balance))

  tx = await box.hasRolled(numberOfDie, dieSize, adjustment, result);
  await tx.wait();
  console.log('tx2: ' + JSON.stringify(tx))

  balance = await ethers.provider.getBalance(deployer.address)
  console.log('Balance: ' + ethers.utils.formatEther(balance))

  hasRolled = await box.hasRolledOnce( deployer.address );
  console.log('hasRolled 3: ' + hasRolled);  

  balance = await ethers.provider.getBalance(deployer.address)
  console.log('Balance: ' + ethers.utils.formatEther(balance))
  */
}
catch(err){
  console.log('error: ' + err.stack)
}
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });