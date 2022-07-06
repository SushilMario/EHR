import React, { Component } from 'react';

import { Input, Form, Message, Button } from 'semantic-ui-react';

import { Router } from '../routes';

import retrieveCampaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class ContributeForm extends Component
{
    state = 
    { 
        contribution: '',
        errorMessage: '',
        loading: false,
        processed: false
    };

    onInputChange = evt =>
    {
        this.setState({ contribution: evt.target.value });
    }

    onSubmit = async (evt) =>
    {
        evt.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try
        {
            const accounts = await web3.eth.getAccounts();

            const campaign = retrieveCampaign(this.props.address);

            await campaign.methods
                .contribute()
                .send (
                    {
                        from: accounts[0],
                        value: this.state.contribution
                    }
                );

            this.setState({ loading: false, processed: true });

            Router.replaceRoute(`/campaigns/${this.props.address}`);
        }
        catch(err)
        {
            this.setState({ errorMessage: err.message, loading: false });
        }
    }

    render()
    {
        return (
            <Form onSubmit = { this.onSubmit } error = { this.state.errorMessage ? true : false }>
                <Form.Field>
                    <label>Enter Contribution Amount</label>
                    <Input 
                        label = 'wei' 
                        labelPosition = 'right'
                        placeholder = '100' 
                        onChange = {this.onInputChange} 
                        value = { this.state.contribution }
                    />
                </Form.Field>
    
                <Message 
                    error
                    header = "There was an error"
                    content = { this.state.errorMessage }
                />
    
                <Button 
                    loading = { this.state.loading } 
                    primary = { !this.state.processed } 
                    positive = { this.state.processed } 
                    type = "submit"
                >
                    { this.state.processed ? 'Success!' : 'Contribute' }
                </Button>
            </Form>
        );
    }
}

export default ContributeForm;