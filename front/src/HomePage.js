import React, { useState } from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import { Button, Row, Col, Image } from 'antd';
import { connect } from 'react-redux';
import Nav from './Nav';
import MikeChicken from './images/MikeChickenLeft.png';

function HomePage({ username }) {
  const [loadingGo, setLoadingGo] = useState(false); //état lié à l'indicateur de chargement lorsqu'on clique sur le bouton "GO"
  const [loadingAdvices, setLoadingAdvices] = useState(false); //état lié à l'indicateur de chargement lorsqu'on clique sur le bouton "Des conseils!"

  const handleGo = () => {
    setLoadingGo(true);
  };

  if (loadingGo) {
    return <Redirect to="/interviewhomepage" />;
  }

  const handleAdvices = () => {
    setLoadingAdvices(true);
  };

  if (loadingAdvices) {
    return <Redirect to="/advices" />;
  }

  return (
    <div>
      <Nav />
      <Row
        gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
        style={{ marginTop: '8px' }}
      >
        <Col
          xs={24}
          style={{
            textAlign: 'center',
            marginBottom: '8px',
            marginLeft: '8px',
          }}
          className="title"
        >
          Bienvenue {username}!
        </Col>
        <Col xs={24} style={{ textAlign: 'center' }}>
          <Image
            width={200}
            src={MikeChicken}
            alt="MikeChickenImg"
            preview={false}
          />
        </Col>
        <Col xs={24} style={{ textAlign: 'center' }} className="text">
          InterviewCop vous entraîne à passer des entretiens d'embauche.
          Prêt(e)?
        </Col>
        <Col xs={24} style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            loading={loadingGo === true ? true : false}
            onClick={() => handleGo()}
          >
            GO!
          </Button>
        </Col>
        <Col xs={24} style={{ textAlign: 'center', marginRight: '8px' }}>
          <Button
            type="primary"
            loading={loadingAdvices === true ? true : false}
            onClick={() => handleAdvices()}
          >
            Des conseils!
          </Button>
        </Col>
      </Row>
    </div>
  );
}

function mapStateToProps(state) {
  return { username: state.username };
}

export default connect(mapStateToProps, null)(HomePage);
