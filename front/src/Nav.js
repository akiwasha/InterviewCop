import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserAlt,
  faRunning,
  faBookOpen,
  faStore,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons';

function Nav() {
  return (
    <nav>
      <Menu mode="horizontal" theme="dark">
        <Menu.Item key="title" className="title">
          <Link to="/homepage">InterviewCop</Link>
        </Menu.Item>
        <Menu.Item key="account">
          <Link to="/account">
            <FontAwesomeIcon icon={faUserAlt} />
            Mon compte
          </Link>
        </Menu.Item>
        <Menu.Item key="interview">
          <Link to="/interviewhomepage">
            <FontAwesomeIcon icon={faRunning} />
            Entretien
          </Link>
        </Menu.Item>
        <Menu.Item key="advices">
          <Link to="/advices">
            <FontAwesomeIcon icon={faBookOpen} />
            Conseil
          </Link>
        </Menu.Item>
        <Menu.Item key="shop">
          <Link to="/shop">
            <FontAwesomeIcon icon={faStore} />
            Shop
          </Link>
        </Menu.Item>
        <Menu.Item key="app">
          <Link to="/">
            <FontAwesomeIcon icon={faPowerOff} />
            Déconnection
          </Link>
        </Menu.Item>
      </Menu>
    </nav>
  );
}

export default Nav;
