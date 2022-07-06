import React, { Component } from 'react';

import { Button, Message } from 'semantic-ui-react';

import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';

import web3 from '../../../ethereum/web3';
import contract from '../../../ethereum/contract';

import 'semantic-ui-css/semantic.min.css';

class AdminIndex extends Component
{
    render()
    {
        return (
            <Layout>
                <Link route = '/users/admin/doctors/new'>
                    <a>
                        <Button>
                            Add doctor
                        </Button>
                    </a>
                </Link>
                <Link route = '/users/admin/patients/new'>
                    <a>
                        <Button>
                            Add patient
                        </Button>
                    </a>
                </Link>
                <Link route = '/users/admin/assign'>
                    <a>
                        <Button>
                            Assign
                        </Button>
                    </a>
                </Link>
            </Layout>
        );
    }
}

export default AdminIndex;