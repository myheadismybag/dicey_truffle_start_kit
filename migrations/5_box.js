const Box = artifacts.require('Box')

module.exports = async (deployer, network, [defaultAccount]) => {
    // Local (development) networks need their own deployment of the LINK
    // token and the Oracle contract
        // For now, this is hard coded to Kovan
        deployer.deploy(Box)
    
}
