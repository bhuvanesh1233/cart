import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import Search from "./Search"
const Header = ()=> {
    return (
        <header>
            <div className="container">
                <Link to="/" className="logo">
                    <img width="150px" src="/images/logo.png" alt="Description" />
                </Link>

                {/* Search Bar */}
                <Search />
                {/* User Options */}

                <div className="user-options">
                    <Link to="/account">
                        <FontAwesomeIcon icon={faUser} className="icon" />
                        <span>Account</span>
                    </Link>
                    <Link to="/orders">Orders</Link>
                    <Link to="/cart" className="cart">
                        <FontAwesomeIcon icon={faShoppingCart} className="icon" />
                        <span>Cart</span>
                        <span className="cart-count">0</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
