import React, { Component } from 'react';

import { Button, Table } from 'semantic-ui-react';

import web3 from '../ethereum/web3';
import contract from '../ethereum/contract';

import { Link, Router } from '../routes';

class RecordRow extends Component
{
    render()
    {
        const { Row, Cell } = Table;
        const { number, record, routeStart } = this.props;

        return (
            <Row>
                <Cell textAlign = 'center'>
                    { number }
                </Cell>
                <Cell textAlign = 'center'>
                    { record.doctorName }
                </Cell>
                <Cell textAlign = 'center'>
                    { record.patientName }
                </Cell>
                <Cell textAlign = 'center'>
                    <Link route = { `${routeStart}/records/${number}` }>
                        <a>
                            <Button primary>
                                View Record
                            </Button>
                        </a>
                    </Link>
                </Cell>
            </Row>
        );
    }
}

export default RecordRow;