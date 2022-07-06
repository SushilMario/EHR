const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach
(
    async () =>
    {
        accounts = await web3.eth.getAccounts();

        factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)).
            deploy({ data: compiledFactory.bytecode }).
            send({ from: accounts[0], gas: '1000000' });
        
        await factory.methods.createCampaign('100')
            .send({ from: accounts[0], gas: '1000000' });

        [campaignAddress] = await factory.methods.getCampaigns().call();

        campaign = await new web3.eth.Contract
        (
            JSON.parse(compiledCampaign.interface),
            campaignAddress
        );
    }
);

describe
(
    'Campaigns',
    () =>
    {
        it
        (
            'deploys a campaign factory',
            () =>
            {
                assert.ok(factory.options.address);
            }
        );
        
        it
        (
            'deploys a campaign',
            () =>
            {
                assert.ok(campaign.options.address);
            }
        );

        it
        (
            'sets the manager to be the campaign creator',
            async () =>
            {
                const manager = await campaign.methods.manager().call();
                assert.equal(accounts[0], manager);
            }
        );

        it
        (
            'designates a contributor as an approver',
            async () =>
            {
                await campaign.methods.contribute().send
                (
                    {
                        from: accounts[1],
                        value: '200',
                        gas: '1000000'
                    } 
                );

                const presence = await campaign.methods.approvers(accounts[1]).call();

                assert.ok(presence);
            }
        );

        it
        (
            'requires a minimum amount to contribute',
            async () =>
            {
                try 
                {
                    await campaign.methods.contribute().send
                    (
                        {
                            from: accounts[2],
                            value: '10'
                        }
                    );

                    assert(false);
                } 
                catch(error) 
                {
                    assert(error);
                }
            }
        );

        it
        (
            'allows the manager to create a payment request',
            async () =>
            {
                const description = 'to place an order of screws';

                await campaign.methods.createRequest
                (
                    description,
                    '100',
                    accounts[3]
                ).send
                (
                    {
                        from: accounts[0],
                        gas: '1000000'
                    }
                );

                const request = await campaign.methods.requests(0).call();

                assert.equal(description, request.description);
            }
        );

        it
        (
            'manages all aspects of a campaign',
            async () =>
            {
                // Adding approvers
                await campaign.methods.contribute().send
                (
                    {
                        from: accounts[1],
                        value: web3.utils.toWei('3', 'ether'),
                        gas: '1000000'
                    } 
                );

                await campaign.methods.contribute().send
                (
                    {
                        from: accounts[2],
                        value: web3.utils.toWei('3', 'ether'),
                        gas: '1000000'
                    } 
                );

                const presence1 = await campaign.methods.approvers(accounts[1]).call();
                const presence2 = await campaign.methods.approvers(accounts[2]).call();

                assert.ok(presence1);
                assert.ok(presence2);

                // Creating a payment request as manager
                const description = 'to place an order of screws';

                await campaign.methods.createRequest
                (
                    description,
                    web3.utils.toWei('2', 'ether'),
                    accounts[3]
                ).send
                (
                    {
                        from: accounts[0],
                        gas: '1000000'
                    }
                );

                const request = await campaign.methods.requests(0).call();

                assert.equal(description, request.description);

                // Approving the request
                await campaign.methods.approveRequest(0, 1).send
                (
                    {
                        from: accounts[1],
                        gas: '1000000'
                    }
                );

                await campaign.methods.approveRequest(0, 1).send
                (
                    {
                        from: accounts[2],
                        gas: '1000000'
                    }
                );

                // Balance of recipient (3) before finalising request
                const initialBalance = await web3.eth.getBalance(accounts[3]);

                // Finalise the request
                await campaign.methods.finaliseRequest(0).send
                (
                    {
                        from: accounts[0],
                        gas: '1000000'
                    }
                );

                // Balance of recipient (3) after finalising request
                const newBalance = await web3.eth.getBalance(accounts[3]);

                // Asserting the difference
                const difference = newBalance - initialBalance;
                assert.ok(difference > web3.utils.toWei('1.9', 'ether'));
            }
        )
    }
)