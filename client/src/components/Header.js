import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <nav className="nav-wrapper">
                <li className="brand-logo"><Link to="/">IT course</Link></li>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><Link to="/shop">Shop</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>
        </nav>
    )
}

export default Header;