const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledContract = require('./build/Contract.json');

const provider = new HDWalletProvider
(
    'attack mutual paper camera genius agree useless slow among round salmon blade',
    'https://rinkeby.infura.io/v3/d4543c0d86584854810ff495efe73a65'
);

const web3 = new Web3(provider);

const abi = compiledContract.abi;
const bytecode = compiledContract.evm.bytecode.object;
 
const deploy = async () => 
{
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account", accounts[0]);
 
    const result = await new web3.eth.Contract(abi)
        .deploy({ data: '0x' + bytecode })
        .send({ from: accounts[0] })
        .catch(err => console.log(err))
    
    console.log("Contract deployed to", result.options.address);
    provider.engine.stop();
};

deploy();
