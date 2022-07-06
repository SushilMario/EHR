import React, { Component } from 'react';

import Layout from '../components/Layout';
import { Link, Router } from '../routes';
import { Card, Button, Message } from 'semantic-ui-react';

import contract from '../ethereum/contract';
import web3 from '../ethereum/web3';

import 'semantic-ui-css/semantic.min.css';

class LandingPage extends Component
{
    state = 
    {
        errorMessage: ''
    };

    onButtonPressed = async (evt) =>
    {
        this.setState({ errorMessage: '' });

        try
        {
            const accounts = await web3.eth.getAccounts();

            const adminAddress = await contract.methods.admin().call();

            const isAdmin = accounts[0] == adminAddress;

            const isPatient = await contract.methods.isPatient(accounts[0]).call();
            const isDoctor = await contract.methods.isDoctor(accounts[0]).call();

            if(isAdmin)
            {
                Router.pushRoute('/users/admin');
            }
            else if(isPatient)
            {
                Router.pushRoute("/users/patient");
            }
            else if(isDoctor)
            {
                Router.pushRoute("/users/doctor");
            }
            else
            {
                this.setState({ errorMessage: "You are not a registered user" })
            }
        }
        catch(err)
        {
            this.setState({ errorMessage: err.message });
        }
    }

    render()
    {
        return (
            <Layout>
                <Button
                    primary
                    onClick = { this.onButtonPressed }
                >
                    Get started
                </Button>

                <Message 
                    hidden = { !this.state.errorMessage }
                    error
                    header = "Error!"
                    content = { this.state.errorMessage }
                />

                <div>
                    { this.props.isAdmin }
                </div>
            </Layout>
        );
    }
}

export default LandingPage;