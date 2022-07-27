const { Gateway, Wallets, DefaultEventHandlerStrategies } = require('fabric-network');
const fs = require('fs');
const path = require("path")
const log4js = require('log4js');
const logger = log4js.getLogger('test-network');
const util = require('util')

const auth = require('./auth');
const { CLIENT_RENEG_LIMIT } = require('tls');

const invokeTransaction = async (channelName, chaincodeName, fcn, args, username, org_name ) => {
    try {
        logger.debug(util.format('\n============ invoke transaction on channel %s ============\n', channelName));

      
        const ccp = await auth.getCCP(org_name)

        // Create a new file system based wallet for managing identities.
        const walletPath = await auth.getWalletPath(org_name) //path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await auth.getRegisteredUser(username, org_name, true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }
                   console.log('---------- channelName and chaincodeName successfully checked --------------')
        

        const connectOptions = {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true },
            eventHandlerOptions: {
                commitTimeout: 100,
                strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX
            }
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, connectOptions);

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        const contract = network.getContract(chaincodeName);

        let result
        let message;
        
        if (fcn === "createStudent") {
            let timestamp = new Date (); 
            result = await contract.submitTransaction(fcn, args[0], args[1],args[2], args[3],args[4],args[5],args[6],args[7],args[8],args[9],args[10],args[11],timestamp);
            message = `Student created Successfully ${args[0]} with name ${args[1]}}`;
            console.log(`event for createStudent ${message} `)
         }

         else if (fcn === "univeristyData") {
            let timestamp = new Date (); 
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], args[3],args[4],args[5],args[6], timestamp);
            message = `University  data is on Chain of university id : ${args[0]} with student id: ${args[1]}  and status ${args[5]}`;
            console.log(`amount transfer: ${message} `)
         }  
        
        else {
            return `Invocation require either createMaturity or createCO2Emissions as function but got ${fcn}`
        }

        await gateway.disconnect();

        // result = JSON.parse(result);

        let response = {
            message: message,
            result
        }

        return response;


    } catch (error) {

        console.log(`Getting error: ${error}`)
        return error.message

    }
}

exports.invokeTransaction = invokeTransaction;