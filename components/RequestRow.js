import React, { Component } from 'react';

import { Button, Table } from 'semantic-ui-react';

import web3 from '../ethereum/web3';
import retrieveCampaign from '../ethereum/campaign';

import { Router } from '../routes';

class RequestRow extends Component
{
    state = 
    {
        voted: this.props.request.voted,
        complete: this.props.request.complete,

        approveLoading: false,
        rejectLoading: false,
        finaliseLoading: false,

        approveProcessed: false,
        rejectProcessed: false,
        finaliseProcessed: false
    };

    onApproveButtonPress = async (event) =>
    {
        const campaign = retrieveCampaign(this.props.address);
        const accounts = await web3.eth.getAccounts();

        this.setState({ approveLoading: true });

        await campaign.methods
            .approveRequest(this.props.ID, 1)
            .send( { from: accounts[0] } );

        this.setState({ voted: true, approveLoading: false });

        Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    }

    onRejectButtonPress = async (event) =>
    {
        const campaign = retrieveCampaign(this.props.address);
        const accounts = await web3.eth.getAccounts();

        this.setState({ rejectLoading: true });

        await campaign.methods
            .approveRequest(this.props.ID, 0)
            .send( { from: accounts[0] } );

        this.setState({ voted: true, rejectLoading: false });

        Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    }

    onFinaliseButtonPress = async (event) =>
    {
        const campaign = retrieveCampaign(this.props.address);
        const accounts = await web3.eth.getAccounts();

        this.setState({ finaliseLoading: true });

        await campaign.methods
            .finaliseRequest(this.props.ID)
            .send( { from: accounts[0] } );

        this.setState({ complete: true, finaliseLoading: false });

        Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    }

    render()
    {
        const { Row, Cell } = Table;
        const { ID, request, approverCount } = this.props;

        console.log(this.props.approvalGuarantee);

        const lastColumns = [];

        if(this.props.isManager)
        {
            lastColumns.push
            (
                <Cell textAlign = 'center'>
                    <Button 
                        primary disabled = { this.state.voted } 
                        onClick = { this.onApproveButtonPress } 
                        loading = { this.state.approveLoading }
                        positive = { this.state.approveProcessed }
                    >
                        { this.state.approveProcessed ? 'Approved!' : 'Approve' }
                    </Button>
                </Cell>,
                <Cell textAlign = 'center'>
                    <Button 
                        color = 'red' disabled = { this.state.voted } 
                        onClick = { this.onApproveButtonPress } 
                        loading = { this.state.rejectLoading }
                        positive = { this.state.rejectProcessed }
                    >
                        { this.state.rejectProcessed ? 'Rejected' : 'Reject' }
                    </Button>
                </Cell>
            );
        }
        else
        {
            lastColumns.push
            (
                <Cell textAlign = 'center'>
                    <Button 
                        primary disabled = { this.state.complete } 
                        onClick = { this.onFinaliseButtonPress } 
                        loading = { this.state.finaliseLoading }
                        positive = { this.state.finaliseProcessed }
                    >
                        { this.state.finaliseProcessed ? 'Finalised' : 'Finalise' }
                    </Button>
                </Cell>
            );
        }

        return (
            <Row positive = { this.props.approvalGuarantee } negative = { !this.props.approvalGuarantee }>
                <Cell textAlign = 'center'>
                    { ID }
                </Cell>
                <Cell textAlign = 'center'>
                    { request.description }
                </Cell>
                <Cell textAlign = 'center'>
                    { request.value + ' wei' }
                </Cell>
                <Cell textAlign = 'center'>
                    <a href = { `https://rinkeby.etherscan.io/address/${request.recipient}` }>
                        { request.recipient }
                    </a>
                </Cell>
                <Cell textAlign = 'center'>
                    { `${request.approvalCount} / ${approverCount}` }
                </Cell>
                { lastColumns }
            </Row>
        );
    }
}

export default RequestRow;