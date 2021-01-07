import React, { useState, useEffect } from 'react';
import './App.css';
import { Avatar, Col, Comment, Input, Row, Skeleton, Tooltip } from 'antd';
import Nav from './Nav';
import { connect } from 'react-redux';
import socketIOClient from 'socket.io-client';
import moment from 'moment';
import { UserOutlined } from '@ant-design/icons';
import MikeChickenSmall from './images/MikeChickenSmall.png';

const socket = socketIOClient();

function ChatPage({ username }) {
  //   const [currentMessage, setCurrentMessage] = useState(null);
  const [listMessage, setListMessage] = useState([]);

  useEffect(() => {
    socket.emit('sendWelcomeMessage', { currentMessage: '', username });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on('welcomeMessage', (newMessage) => {
      var regexSmile = /:\)/;
      var newStr = newMessage.currentMessage.replace(regexSmile, '\u263A');
      newMessage.currentMessage = newStr;
      setListMessage([...listMessage, newMessage]);
    });
    socket.on('sendMessageToAll', (newMessage) => {
      var regexSmile = /:\)/;
      var regexSad = /:\(/;
      var regexLangue = /:\p/;
      var regexFuck = /fuck[a-z]*/i;
      var newStr = newMessage.currentMessage
        .replace(regexSmile, '\u263A')
        .replace(regexSad, '\u2639')
        .replace(regexLangue, '\uD83D\uDE1B')
        .replace(regexFuck, '\u2022\u2022\u2022');
      newMessage.currentMessage = newStr;
      setListMessage([...listMessage, newMessage]);
    });
  }, [listMessage]);

  const affichageMessages = listMessage.map((e, i) => {
    if (e.username !== username) {
      return (
        <Col xs={24} key={i}>
          <Comment
            // eslint-disable-next-line
            author={<a className="text">{e.username}</a>}
            avatar={<Avatar src={MikeChickenSmall} alt={e.username} />}
            content={<p className="text">{e.currentMessage}</p>}
            datetime={
              <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                <span>{moment().fromNow()}</span>
              </Tooltip>
            }
          />
        </Col>
      );
    } else
      return (
        <Col xs={24} key={i}>
          <Comment
            // eslint-disable-next-line
            author={<a className="text">{e.username}</a>}
            avatar={<Avatar icon={<UserOutlined />} />}
            content={<p className="text">{e.currentMessage}</p>}
            datetime={
              <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                <span>{moment().fromNow()}</span>
              </Tooltip>
            }
          />
        </Col>
      );
  });

  if (!listMessage) {
    return <Skeleton />;
  }

  return (
    <div>
      <Nav />
      <Row>{affichageMessages}</Row>
      <Row align={'bottom'}>
        <Input
          placeholder="Tapez votre message ici"
          prefix={<UserOutlined />}
          allowClear={true}
          //   value={currentMessage}
          //   onChange={(e) => setCurrentMessage(e)}
          onPressEnter={(e) => {
            socket.emit('sendMessage', {
              currentMessage: e.target.value,
              username,
            });
          }}
        />
      </Row>
    </div>
  );
}

function mapStateToProps(state) {
  return { username: state.username };
}

export default connect(mapStateToProps, null)(ChatPage);
