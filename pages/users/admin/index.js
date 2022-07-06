import React, { Component } from 'react';

import { Button, Message } from 'semantic-ui-react';

import { Link, Router } from '../../../routes';

import web3 from '../../../ethereum/web3';
import contract from '../../../ethereum/contract';

import 'semantic-ui-css/semantic.min.css';

class AdminIndex extends Component
{
    render()
    {
        let display;

        if(this.props.isAdmin)
        {
            display = <div>Hi, admin!</div>;
        }

        else
        {
            display = 
            <Message 
                    error
                    header = "Error!"
                    content = "You are not an admin"
            />;
        }

        return (
            display
        );
    }
}

export default AdminIndex;