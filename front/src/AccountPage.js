import React, { useEffect, useState } from 'react';
import './App.css';
import Nav from './Nav';
import { Redirect } from 'react-router-dom';
import { Button, Col, Image, Row, Skeleton } from 'antd';
import { connect } from 'react-redux';

import MikeChickenSmall from './images/MikeChickenSmall.png';
import AgentToufSmall from './images/AgentToufSmall.png';
import badgeparfait from './images/badgeparfait.png';
import badgepresqueparfait from './images/badgepresqueparfait.png';
import badgeaparfaire from './images/badgeaparfaire.png';

function AccountPage({ username }) {
  const [userScores, setUserScores] = useState();
  const [userTrophies, setUserTrophies] = useState();
  const [userIcops, setUserIcops] = useState();
  const [userPackage, setUserPackage] = useState();
  const [listErrors, setListErrors] = useState();
  const [listErrorsScores, setListErrorsScores] = useState();
  const [listErrorsTrophies, setListErrorsTrophies] = useState();
  const [listErrorsPackage, setListErrorsPackage] = useState();
  const [listErrorsIcops, setListErrorsIcops] = useState();
  const [loadingShop, setLoadingShop] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  //charge les scores, trophées, icops et package du user via le Back (via la BDD)
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `/accountfind-informationdatabase?usernameFromFront=${username}`
      );
      const body = await data.json();
      if (body.result === true) {
        setUserScores(body.scoresDataBase);
        setUserTrophies(body.trophiesDataBase);
        setUserIcops(body.icopsDataBase);
        setUserPackage(body.packageDataBase);
        setListErrorsScores(body.errorscores);
        setListErrorsTrophies(body.errortrophies);
        setListErrorsPackage(body.errorpackage);
        setListErrorsIcops(body.erroricops);
      } else {
        setListErrors(body.error);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  if (loadingShop) {
    return <Redirect to="/shop" />;
  }

  if (loadingChat) {
    return <Redirect to="/chat" />;
  }

  if (!userIcops || !userPackage || !userScores || !userTrophies) {
    //mécanique pour attendre que les informations soient chargées avant de générer le screen
    return <Skeleton />;
  } else {
    return (
      <div>
        <Nav />
        <Row style={{ marginTop: '10px' }}>
          <Col xs={24} style={{ textAlign: 'center' }}>
            <p className="title">Mes scores aux derniers entretiens</p>
          </Col>
          {userScores && (
            <Col xs={24} style={{ textAlign: 'center' }}>
              {userScores.length > 0 ? (
                <Col xs={24}>
                  <p className="text">
                    {userScores[userScores.length - 3]} / 100
                  </p>
                  <p className="text">
                    {userScores[userScores.length - 2]} / 100
                  </p>
                  <p className="text">
                    {userScores[userScores.length - 1]} / 100
                  </p>
                </Col>
              ) : (
                <p className="text">{listErrorsScores}</p>
              )}
            </Col>
          )}
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col xs={24}>
            <Col xs={24} style={{ textAlign: 'center' }}>
              <p className="title">Mes trophées</p>
            </Col>
            <Col xs={24} style={{ textAlign: 'center' }}>
              {userTrophies && (
                <Col xs={24} style={{ textAlign: 'center' }}>
                  {userTrophies.length > 0 ? (
                    userTrophies.map((trophies, i) => {
                      // vérification des nombres des trophées stockés précédemment dans l'état userTrophies pour pouvoir attribuer une image de trophée en fonction
                      let path;
                      if (trophies.number === 1) {
                        path = badgeparfait;
                      } else if (trophies.number === 2) {
                        path = badgepresqueparfait;
                      } else if (trophies.number === 3) {
                        path = badgeaparfaire;
                      }
                      return (
                        <Image
                          key={i}
                          src={path}
                          alt="trophiespics"
                          width={200}
                          preview={false}
                        />
                      );
                    })
                  ) : (
                    <p className="text">{listErrorsTrophies}</p>
                  )}
                </Col>
              )}
            </Col>
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col xs={12}>
            <Col xs={24} style={{ textAlign: 'center' }}>
              <Col xs={24}>
                <p className="title">Ma formule</p>
              </Col>
              {userPackage ? (
                <Col xs={24} style={{ textAlign: 'center' }}>
                  <p className="text">
                    Ma formule {userPackage.name} {'\n'} à {userPackage.price} €
                  </p>
                  {(userPackage.name === 'Free' ||
                    userPackage.name === '+') && (
                    <Button
                      onClick={() => {
                        setLoadingShop(true);
                      }}
                      type="primary"
                    >
                      Upgrade!
                    </Button>
                  )}
                </Col>
              ) : (
                <p className="text">{listErrorsPackage}</p>
              )}
            </Col>
          </Col>
          <Col xs={12} style={{ textAlign: 'center' }}>
            <Col xs={24}>
              <p className="title">Mes iCops</p>
            </Col>
            {userIcops.length > 0 ? (
              <Col xs={24} style={{ textAlign: 'center' }}>
                <Image
                  src={MikeChickenSmall}
                  alt="icoppic"
                  preview={false}
                  width={150}
                />
                <Image
                  src={AgentToufSmall}
                  alt="icoppic"
                  preview={false}
                  width={150}
                />
              </Col>
            ) : (
              <p className="text">{listErrorsIcops}</p>
            )}
          </Col>
        </Row>
        <Row>
          {userPackage && (
            <Col xs={20} offset={2} style={{ textAlign: 'center' }}>
              {userPackage.name === 'Pro' && (
                <Button
                  onClick={() => {
                    setLoadingChat(true);
                  }}
                  type="primary"
                >
                  Chat
                </Button>
              )}
            </Col>
          )}
          <Col xs={20} offset={2} style={{ textAlign: 'center' }}>
            <p className="text">{listErrors}</p>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { username: state.username, score: state.score };
}

export default connect(mapStateToProps, null)(AccountPage);
