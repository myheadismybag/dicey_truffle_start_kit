const { assert } = require('chai')
const { expectRevert } = require('@openzeppelin/test-helpers')

contract('RandomNumberConsumer', accounts => {
    const RandomNumberConsumer = artifacts.require('RandomNumberConsumer')
    const VRFCoordinatorMock = artifacts.require('VRFCoordinatorMock')
    const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
    const defaultAccount = accounts[0]
    let randomNumberConsumer, vrfCoordinatorMock, link, keyhash, fee

    describe('#request random number', () => {
        beforeEach(async () => {
            LinkToken.setProvider(web3.currentProvider)
            // Oracle.setProvider(web3.currentProvider)

            keyhash = '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4'
            fee = '1000000000000000000'
            link = await LinkToken.new({ from: defaultAccount })
            vrfCoordinatorMock = await VRFCoordinatorMock.new(link.address, { from: defaultAccount })
            randomNumberConsumer = await RandomNumberConsumer.new(link.address, keyhash, vrfCoordinatorMock.address, fee, { from: defaultAccount })
        })
       
        it('returns a random number with link', async () => {
            try {
            await link.transfer(randomNumberConsumer.address, web3.utils.toWei('1', 'ether'), { from: defaultAccount })
            let transaction = await randomNumberConsumer.getRandomNumber({ from: defaultAccount })
            console.log('transaction: ' + JSON.stringify(transaction))
            assert.exists(transaction.receipt.rawLogs)
            // This is the event that is emitted
            let requestId = transaction.receipt.rawLogs[3].topics[0]
            console.log('requestId: ' + requestId);
            assert.exists(requestId)
            // let requestId = await randomNumberConsumer.lastRequestId({ from: defaultAccount })
            await vrfCoordinatorMock.callBackWithRandomness(requestId, '777', randomNumberConsumer.address, { from: defaultAccount })
            let randomNumber = await randomNumberConsumer.randomResult({ from: defaultAccount })
            console.log('randomNumber: ' + randomNumber);
            assert.equal(randomNumber, 777)
            }
            catch(err) {
                console.log('err: ' + err.stack)
            }
        })
    })
})
