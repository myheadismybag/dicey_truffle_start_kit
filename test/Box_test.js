/* eslint-disable @typescript-eslint/no-var-requires */
const { oracle } = require('@chainlink/test-helpers')
const { expectRevert, time } = require('@openzeppelin/test-helpers')

contract('Box', accounts => {
  const Box = artifacts.require('Box')

  const addr1 = accounts[0]
  const addr2 = accounts[1]
  const stranger = accounts[2]
  const consumer = accounts[3]

  console.log('aaaa: ' + addr1)
  console.log('aaaa: ' + addr2)

  // Represents 1 LINK for testnet requests
  const payment = web3.utils.toWei('1')

  let link, oc, box

  beforeEach(async () => {
    box = await Box.new()
    console.log('Deployed Address: ' + box)
  })

  describe('Box', () => {
    context('test 1', () => {
      it('does something', async () => {

        try {
            // balance = await ethers.provider.getBalance(addr1)
            // console.log('Balance: ' + ethers.utils.formatEther(balance))

            let hasRolled = await box.hasRolledBefore( addr1 );
            console.log('hasRolled 1: ' + hasRolled);
            assert.equal(hasRolled, false, "Address should return true");

            // balance = await ethers.provider.getBalance(addr1)
            // console.log('Balance: ' + ethers.utils.formatEther(balance))

            const numberOfDie = 4;
            const dieSize = 10;
            const adjustment = 0;
            const result = 13;
            let tx = await box.hasRolled(numberOfDie, dieSize, adjustment, result);
            // await tx.wait();
            console.log('tx1: ' + JSON.stringify(tx))

            // balance = await ethers.provider.getBalance(addr1)
            // console.log('Balance: ' + ethers.utils.formatEther(balance))

            hasRolled = await box.hasRolledBefore( addr1 );
            console.log('hasRolled 2: ' + hasRolled);
            assert.equal(hasRolled, true, "Address should return true");

            tx = await box.hasRolled(numberOfDie, dieSize, adjustment, result);
            // await tx.wait();
            console.log('tx2: ' + JSON.stringify(tx))

            // balance = await ethers.provider.getBalance(addr1)
            // console.log('Balance: ' + ethers.utils.formatEther(balance))


            hasRolled = await box.hasRolledBefore( addr1 );
            console.log('hasRolled 3: ' + hasRolled);
            assert.equal(hasRolled, true, "Address should return true");

            hasRolled = await box.hasRolledOnce( addr1 );
            console.log('hasRolled 4: ' + hasRolled);  
            }
          catch(err) {
            console.log('err: ' + err.stack)
          }
          
      })


        /**
          This test always seems to fail when run on kovan because of out of gas:
          npx hardhat test ./test/Box.test.js --network kovan --verbose

          Yet works find when I manually run on remix or the hardhard console:
          npx hardhat console --network kovan

          const Box = await ethers.getContractFactory('Box');

          [addr1, addr2] = await ethers.getSigners();

          const box = await Box.attach('0x5345E54377694f87BaD6cc5fc7eA068f492B32c3')

          const numberOfDie = 4;
          const dieSize = 10;
          const adjustment = 0;
          const result = 13;
          let tx = await box.hasRolled(numberOfDie, dieSize, adjustment, result);

          kovan.etherscan.io shows that 98% of gas is used when run manually, but 100% when run via hardhat.

          FAILS
        */
        it('will return true from hasRolledOnce when an address has called hasRolled.', async function() {
          console.log('Address1: ' + addr1)
          let hasRolled = await box.hasRolledOnce( addr1 );
          // assert.equal(hasRolled, false, "Address should return true");
          expect(hasRolled).to.equal(false);

          const numberOfDie = 4;
          const dieSize = 10;
          const adjustment = 0;
          const result = 13;
          let tx = await box.hasRolled(numberOfDie, dieSize, adjustment, result);
          // await tx.wait();
          console.log('tx1: ' + JSON.stringify(tx))
          hasRolled = await box.hasRolledOnce( addr1 );
          assert.equal(hasRolled, true, "Address should return true");
          // expect(hasRolled).to.equal(true);

          // Rolling again will not change the result
          tx = await box.hasRolled(numberOfDie, dieSize, adjustment, result);
          // await tx.wait();
          console.log('tx2: ' + JSON.stringify(tx))
          hasRolled = await box.hasRolledOnce( addr1 );
          assert.equal(hasRolled, true, "Address should return true");
          // expect(hasRolled).to.equal(true);

          hasRolled = await box.hasRolledOnce( addr1 );
          assert.equal(hasRolled, true, "Address should return true");
          // expect(hasRolled).to.equal(true);

        });      
    })



    /*
    context('with LINK', () => {
      let request

      beforeEach(async () => {
        await link.transfer(cc, web3.utils.toWei('1', 'ether'), {
          from: defaultAccount,
        })
      })

      context('sending a request to a specific oracle contract address', () => {
        it('triggers a log event in the new Oracle contract', async () => {
          const tx = await cc.createRequestTo(
            oc,
            jobId,
            payment,
            url,
            path,
            times,
            { from: consumer },
          )
          request = oracle.decodeRunRequest(tx.receipt.rawLogs[3])
          assert.equal(oc, tx.receipt.rawLogs[3])
          assert.equal(
            request.topic,
            web3.utils.keccak256(
              'OracleRequest(bytes32,address,bytes32,uint256,address,bytes4,uint256,uint256,bytes)',
            ),
          )
        })
      })
    })
    */
  })
/*
  describe('#fulfill', () => {
    const expected = 50000
    const response = web3.utils.padLeft(web3.utils.toHex(expected), 64)
    let request

    beforeEach(async () => {
      await link.transfer(cc, web3.utils.toWei('1', 'ether'), {
        from: defaultAccount,
      })
      const tx = await cc.createRequestTo(
        oc,
        jobId,
        payment,
        url,
        path,
        times,
        { from: consumer },
      )
      request = oracle.decodeRunRequest(tx.receipt.rawLogs[3])
      await oc.fulfillOracleRequest(
        ...oracle.convertFufillParams(request, response, {
          from: oracleNode,
          gas: 500000,
        }),
      )
    })

    it('records the data given to it by the oracle', async () => {
      const currentPrice = await cc.data.call()
      assert.equal(
        web3.utils.padLeft(web3.utils.toHex(currentPrice), 64),
        web3.utils.padLeft(expected, 64),
      )
    })

    context('when my contract does not recognize the request ID', () => {
      const otherId = web3.utils.toHex('otherId')

      beforeEach(async () => {
        request.id = otherId
      })

      it('does not accept the data provided', async () => {
        await expectRevert.unspecified(
          oc.fulfillOracleRequest(
            ...oracle.convertFufillParams(request, response, {
              from: oracleNode,
            }),
          ),
        )
      })
    })

    context('when called by anyone other than the oracle contract', () => {
      it('does not accept the data provided', async () => {
        await expectRevert.unspecified(
          cc.fulfill(request.requestId, response, { from: stranger }),
        )
      })
    })
  })

  describe('#cancelRequest', () => {
    let request

    beforeEach(async () => {
      await link.transfer(cc, web3.utils.toWei('1', 'ether'), {
        from: defaultAccount,
      })
      const tx = await cc.createRequestTo(
        oc,
        jobId,
        payment,
        url,
        path,
        times,
        { from: consumer },
      )
      request = oracle.decodeRunRequest(tx.receipt.rawLogs[3])
    })

    context('before the expiration time', () => {
      it('cannot cancel a request', async () => {
        await expectRevert(
          cc.cancelRequest(
            request.requestId,
            request.payment,
            request.callbackFunc,
            request.expiration,
            { from: consumer },
          ),
          'Request is not expired',
        )
      })
    })

    context('after the expiration time', () => {
      beforeEach(async () => {
        await time.increase(300)
      })

      context('when called by a non-owner', () => {
        it('cannot cancel a request', async () => {
          await expectRevert.unspecified(
            cc.cancelRequest(
              request.requestId,
              request.payment,
              request.callbackFunc,
              request.expiration,
              { from: stranger },
            ),
          )
        })
      })

      context('when called by an owner', () => {
        it('can cancel a request', async () => {
          await cc.cancelRequest(
            request.requestId,
            request.payment,
            request.callbackFunc,
            request.expiration,
            { from: consumer },
          )
        })
      })
    })
  })

  describe('#withdrawLink', () => {
    beforeEach(async () => {
      await link.transfer(cc, web3.utils.toWei('1', 'ether'), {
        from: defaultAccount,
      })
    })

    context('when called by a non-owner', () => {
      it('cannot withdraw', async () => {
        await expectRevert.unspecified(cc.withdrawLink({ from: stranger }))
      })
    })

    context('when called by the owner', () => {
      it('transfers LINK to the owner', async () => {
        const beforeBalance = await link.balanceOf(consumer)
        assert.equal(beforeBalance, '0')
        await cc.withdrawLink({ from: consumer })
        const afterBalance = await link.balanceOf(consumer)
        assert.equal(afterBalance, web3.utils.toWei('1', 'ether'))
      })
    })
  })
  */
})
