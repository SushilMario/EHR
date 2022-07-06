import web3 from './web3';
import Contract from './build/Contract.json';

export default new web3.eth.Contract
(
    Contract["abi"],
    '0xfF2DC004053F15A0333B4930586F3ea3e7e36310'
);