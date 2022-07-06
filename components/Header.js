import React from 'react';

import { Link } from '../routes';
import { Menu } from 'semantic-ui-react';

const Header = () =>
{
    return (
        <Menu style = { {marginTop: '10px'} }>
            <Link route = "/">
                <a className = 'item'>
                    MedRec
                </a>
            </Link>

            {/* <Menu.Menu position = 'right'>
                <Link route = "/">
                    <a className = 'item'>
                        Campaigns
                    </a>
                </Link>

                <Link route = "/campaigns/new">
                    <a className = 'item'>
                        +
                    </a>
                </Link>
            </Menu.Menu> */}
        </Menu>
    );
};

export default Header;