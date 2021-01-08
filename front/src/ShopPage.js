import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, Card, Col, Popconfirm, message, Row, Skeleton } from 'antd';
import { connect } from 'react-redux';
import Nav from './Nav';

function ShopScreen({ username }) {
  const [userPackage, setUserPackage] = useState();

  const [listErrors, setListErrors] = useState();

  //charge le package du user via le Back (via la BDD)
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `/shopfind-package?usernameFromFront=${username}`
      );
      const body = await data.json();
      if (body.result === true) {
        setUserPackage(body.packageDataBase);
      } else {
        setListErrors(body.error);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleSubmitChangePackage = (idPackage) => {
    const fetchData2 = async () => {
      const data = await fetch(
        `/shopupdate-package?usernameFromFront=${username}&packageIdFromFront=${idPackage}`
      );
      const body = await data.json();
      if (body.result === true) {
        setUserPackage(body.packageDataBase);
        message.success('Paiement réussi');
        message.success(
          'Vous avez maintenant accès à de nouvelles fonctionnalités!'
        );
      } else {
        setListErrors(body.error);
      }
    };
    fetchData2();
  };

  if (!userPackage) {
    return <Skeleton />;
  } else {
    return (
      <div>
        <Nav />
        <Row
          gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
          style={{
            marginTop: '8px',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <Col>
            <Card
              title="La formule Free à 0 €"
              style={{ width: 300, marginLeft: '8px' }}
              className="text-alt"
              hoverable
            >
              <p>Parcours entretien illimité</p>
              {userPackage.name !== 'Free' && (
                <Popconfirm
                  title="Veuillez confirmer votre achat"
                  onConfirm={() =>
                    handleSubmitChangePackage('5fd776ffe2b67bdc3438888b')
                  }
                  okText="Oui"
                  cancelText="Non"
                >
                  <Button type="primary">Je la veux!</Button>
                </Popconfirm>
              )}
            </Card>
          </Col>
          <Col>
            <Card
              title="La formule + à 9 €"
              style={{ width: 300 }}
              className="text-alt"
              hoverable
            >
              <p>Parcours entretien illimité</p>
              <p>Rapports approfondis</p>
              {userPackage.name !== '+' && (
                <Popconfirm
                  title="Veuillez confirmer votre achat"
                  onConfirm={() =>
                    handleSubmitChangePackage('5fd777ddab2c4ddc51207488')
                  }
                  okText="Oui"
                  cancelText="Non"
                >
                  <Button type="primary">Je la veux!</Button>
                </Popconfirm>
              )}
            </Card>
          </Col>
          <Col>
            <Card
              title="La formule Pro à 19 €"
              style={{ width: 300, marginRight: '8px' }}
              className="text-alt"
              hoverable
            >
              <p>Parcours entretien illimité</p>
              <p>Rapports approfondis</p>
              <p>Chat avec mon coach</p>

              {userPackage.name !== 'Pro' && (
                <Popconfirm
                  title="Veuillez confirmer votre achat"
                  onConfirm={() =>
                    handleSubmitChangePackage('5fd77864b6d0a5dc87b398db')
                  }
                  okText="Oui"
                  cancelText="Non"
                >
                  <Button type="primary">Je la veux!</Button>
                </Popconfirm>
              )}
            </Card>
          </Col>
        </Row>
        <p className="text">{listErrors}</p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    username: state.username,
  };
}

export default connect(mapStateToProps, null)(ShopScreen);
