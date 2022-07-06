import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Button, Input, Form, Message } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

import { Router } from '../../../routes';

import contract from '../../../ethereum/contract';
import web3 from '../../../ethereum/web3';

class NewPatient extends Component {
    state =
        {
            doctorAddress: '',
            patientAddress: '',

            errorMessage: '',
            loading: false,
            processed: false
        };

    onInputChange = evt => {
        this.setState({ [evt.target.name]: evt.target.value });
    }

    onSubmit = async (evt) => {
        evt.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();

            await contract.methods
                .addPatient(this.state.doctorAddress, this.state.patientAddress)
                .send(
                    {
                        from: accounts[0]
                    }
                )// Wait for transaction to confirm
                .on('confirmation', (confirmationNumber, receipt) => {
                    // If first confirmation...
                    if (confirmationNumber === 1) {
                        this.setState({ loading: false, processed: true });
                        // ... navigate to root URL
                        Router.pushRoute('/users/admin');
                    }
                });
        }
        catch (err) {
            this.setState({ errorMessage: err.message, loading: false });
        }
    }

    render() {
        return (
            <Layout>
                <h2>Assign a doctor to a patient</h2>

                <Form onSubmit={this.onSubmit} error={this.state.errorMessage ? true : false}>
                    <Form.Field>
                        <label>Doctor Address</label>
                        <Input
                            onChange={this.onInputChange}
                            value={this.state.doctorAddress}
                            name='doctorAddress'
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Patient Address</label>
                        <Input
                            onChange={this.onInputChange}
                            value={this.state.patientAddress}
                            name='patientAddress'
                        />
                    </Form.Field>

                    <Message
                        error
                        header="There was an error"
                        content={this.state.errorMessage}
                    />

                    <Button
                        loading={this.state.loading}
                        primary={!this.state.processed}
                        positive={this.state.processed}
                        type="submit"
                    >
                        {this.state.processed ? 'Success!' : 'Submit'}
                    </Button>
                </Form>
            </Layout>
        );
    }
}

export default NewPatient;
