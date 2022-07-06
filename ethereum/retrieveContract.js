import web3 from './web3';
import Contract from './build/Contract.json';

const retrieveContract = address =>
{
    return (
        new web3.eth.Contract
        (
            JSON.parse(Contract.abi),
            address
        )
    );
}


export default retrieveContract;