import React, { useEffect, useState } from 'react';
import './App.css';
import Nav from './Nav';
import { Redirect } from 'react-router-dom';
import { Button, Col, Image, Modal, Rate, Row, Skeleton } from 'antd';
import { connect } from 'react-redux';
import { VictoryBar, VictoryChart, VictoryPie } from 'victory';

import MikeChickenLeft from './images/MikeChickenLeft.png';
import badgeparfait from './images/badgeparfait.png';
import badgepresqueparfait from './images/badgepresqueparfait.png';
import badgeaparfaire from './images/badgeaparfaire.png';

function ResultPage({ username, score, detailedscore, job, county }) {
  const [rating, setRating] = useState(0);
  const [listErrorsNewTrophy, setListErrorsNewTrophy] = useState([]);
  const [lastTrophy, setLastTrophy] = useState('');
  const [salary, setSalary] = useState('Aucune donnée disponible');
  const [userPackage, setUserPackage] = useState();
  const [categoriesScores, setCategoriesScores] = useState();
  const [listErrors, setListErrors] = useState();
  const [isModalOneVisible, setIsModalOneVisible] = useState(false); //état lié à l'ouverture/fermeture de la Modal statistiques détaillées
  const [isModalTwoVisible, setIsModalTwoVisible] = useState(false); //état lié à l'ouverture/fermeture de la Modal suivant "vous avez gagné un trophée"
  const [loadingAdvices, setLoadingAdvices] = useState(false);
  const [loadingInterviewHomepage, setLoadingInterviewHomepage] = useState(
    false
  );
  const [loadingAccountPage, setLoadingAccountPage] = useState(false);

  let trophy;

  useEffect(() => {
    //gestion des résultats par catégorie dans les statistiques détaillées
    const categories = [
      'Parler de soi',
      'Storytelling',
      'Préparatifs de l’entretien',
      'Projection dans l’entreprise',
      'Négociation',
    ];

    const categoriesScores = categories.map((category) => {
      let indices = [];
      let idx = detailedscore.category.indexOf(category);

      while (idx !== -1) {
        indices.push(idx);
        idx = detailedscore.category.indexOf(category, idx + 1);
      }

      let scoreCategory;
      if (indices.length > 0) {
        scoreCategory = indices.map((indice) => {
          let indiceScore = detailedscore.score[indice];
          return indiceScore;
        });
      }

      let numberPointsFalse;
      let numberPointsMax;
      let sumScoreCategory;
      if (typeof scoreCategory !== 'undefined') {
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue;
        sumScoreCategory = scoreCategory.reduce(reducer);
        numberPointsMax = indices.length * 10;
        numberPointsFalse = numberPointsMax - sumScoreCategory;
        return {
          category,
          sumScoreCategory,
          numberPointsMax,
          numberPointsFalse,
        };
      }
      return {
        category: ' ',
        sumScoreCategory: ' ',
        numberPointsMax: ' ',
        numberPointsFalse: ' ',
      };
    });

    //déclenche le setCategoriesScores au chargement de la page pour récupérer les scores détaillés enregistrés dans Redux
    // pour pouvoir l'afficher dans les statistiques détaillées
    setCategoriesScores(categoriesScores);

    //gestion du score 5 étoiles
    let newScore5Star = score / 10 / 2;
    //déclenche le setRating au chargement de la page pour récupérer le dernier score enregistré dans Redux
    // pour pouvoir l'afficher ici dans InterviewScreenResult
    setRating(newScore5Star);

    //calcul du salaire d'embauche en récupérant les infos stockées dans redux et en appelant la route du back correspondante
    const calculateSalary = async () => {
      const data = await fetch(`/scrape-salary?job=${job}&county=${county}`);
      const body = await data.json();

      if (body.result === true) {
        setSalary(body.salary);
      }
    };
    calculateSalary();

    //charge le package du user via le Back (via la BDD)
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

  //Process NewTrophy : se déclenche via le bouton "suivant" après les conseils suite au dernier entretien
  //récupère le dernier trophée gagné dans la BDD via le Back pour pouvoir le montrer à l'utilisateur
  const handleSubmitNewTrophy = async () => {
    const data = await fetch(
      `/interviewfind-lasttrophy?usernameFromFront=${username}`
    );
    const body = await data.json();

    if (body.result === true) {
      setLastTrophy(body.lastTrophyToShow); //on stocke dans un état le trophée récupéré du back
      setListErrorsNewTrophy(body.error);
    }
  };

  // vérification du nombre du trophée stocké précédemment dans l'état pour pouvoir attribuer une image de trophée en fonction
  if (lastTrophy.number) {
    if (lastTrophy.number === 1) {
      trophy = badgeparfait;
    } else if (lastTrophy.number === 2) {
      trophy = badgepresqueparfait;
    } else {
      trophy = badgeaparfaire;
    }
  }

  const handleOkModalOne = () => {
    setIsModalOneVisible(false);
  };

  const handleCancelModalOne = () => {
    setIsModalOneVisible(false);
  };

  const handleOkModalTwo = () => {
    setIsModalTwoVisible(false);
  };

  const handleCancelModalTwo = () => {
    setIsModalTwoVisible(false);
  };

  //message en dessous du bouton Statistiques détaillées si le user a un compte "Free" car il ne peut pas y accéder
  const TextNoStats = (
    <p className="text">Upgrade ton compte pour voir les statistiques !</p>
  );

  if (loadingAdvices) {
    return <Redirect to="/advices" />;
  }

  if (loadingInterviewHomepage) {
    return <Redirect to="/interviewhomepage" />;
  }

  if (loadingAccountPage) {
    return <Redirect to="/account" />;
  }

  if (rating === 0 || !categoriesScores) {
    //mécanique pour attendre que les infos soient chargées avant de générer le screen
    return <Skeleton />;
  } else {
    return (
      <div>
        <Nav />
        <Row>
          <Col xs={24} md={12} style={{ textAlign: 'center' }}>
            <Col xs={24}>
              <p className="title">Mon score</p>
            </Col>
            <Col xs={24} style={{ marginBottom: '8px' }}>
              <Rate disabled defaultValue={rating} />
            </Col>
            {userPackage ? (
              <Col xs={24} style={{ marginBottom: '8px' }}>
                <Button
                  onClick={() => {
                    (userPackage.name === 'Free' ||
                      userPackage.name === '+' ||
                      userPackage.name === 'Pro') &&
                      setIsModalOneVisible(true);
                  }}
                >
                  Statistiques détaillées
                </Button>
                {userPackage.name === 'Free' && TextNoStats}
              </Col>
            ) : (
              <p className="text">{listErrors}</p>
            )}

            <Modal
              title="Statistiques détaillées"
              visible={isModalOneVisible}
              onOk={handleOkModalOne}
              onCancel={handleCancelModalOne}
            >
              <Row>
                <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                  <Col xs={24}>
                    <p className="title-alt">Résultats par question</p>
                  </Col>
                  <Col xs={24}>
                    <VictoryChart
                      padding={{ top: 5, bottom: 40, left: 50, right: 50 }}
                      domainPadding={20}
                      height={180}
                      width={340}
                    >
                      <VictoryBar
                        style={{
                          data: {
                            fill: '#E8C518',
                            stroke: '#0773A3',
                            strokeWidth: 1,
                          },
                        }}
                        data={[
                          { x: 'q1', y: detailedscore.score[0] },
                          { x: 'q2', y: detailedscore.score[1] },
                          { x: 'q3', y: detailedscore.score[2] },
                          { x: 'q4', y: detailedscore.score[3] },
                          { x: 'q5', y: detailedscore.score[4] },
                          { x: 'q6', y: detailedscore.score[5] },
                          { x: 'q7', y: detailedscore.score[6] },
                          { x: 'q8', y: detailedscore.score[7] },
                          { x: 'q9', y: detailedscore.score[8] },
                          { x: 'q10', y: detailedscore.score[9] },
                        ]}
                        cornerRadius={5}
                      />
                    </VictoryChart>
                  </Col>
                </Col>
                <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                  <Col xs={24}>
                    <p className="title-alt">Résultats par catégorie</p>
                  </Col>
                  <Col xs={24}>
                    <VictoryPie
                      data={[
                        {
                          x: `Parler de soi \n ${categoriesScores[0].sumScoreCategory}/${categoriesScores[0].numberPointsMax}`,
                          y: categoriesScores[0].sumScoreCategory,
                        },
                        {
                          x: ' ',
                          y: categoriesScores[0].numberPointsFalse,
                        },
                        {
                          x: `Storytelling \n ${categoriesScores[1].sumScoreCategory}/${categoriesScores[1].numberPointsMax}`,
                          y: categoriesScores[1].sumScoreCategory,
                        },
                        {
                          x: ' ',
                          y: categoriesScores[1].numberPointsFalse,
                        },
                        {
                          x: `Préparatifs \n ${categoriesScores[2].sumScoreCategory}/${categoriesScores[2].numberPointsMax}`,
                          y: categoriesScores[2].sumScoreCategory,
                        },
                        {
                          x: ' ',
                          y: categoriesScores[2].numberPointsFalse,
                        },
                        {
                          x: `Projection \n ${categoriesScores[3].sumScoreCategory}/${categoriesScores[3].numberPointsMax}`,
                          y: categoriesScores[3].sumScoreCategory,
                        },
                        {
                          x: ' ',
                          y: categoriesScores[3].numberPointsFalse,
                        },
                        {
                          x: `Négociation \n ${categoriesScores[4].sumScoreCategory}/${categoriesScores[4].numberPointsMax}`,
                          y: categoriesScores[4].sumScoreCategory,
                        },
                        {
                          x: ' ',
                          y: categoriesScores[4].numberPointsFalse,
                        },
                      ]}
                      height={210}
                      padding={{ top: 50, bottom: 50, left: 40, right: 40 }}
                      colorScale={[
                        '#ED1C24',
                        '#ED1C24B3',
                        '#E8C518',
                        '#E8C518B3',
                        '#208C58',
                        '#208C58B3',
                        '#0773A3',
                        '#0773A3B3',
                        '#333333',
                        '#333333B3',
                      ]}
                      cornerRadius={0}
                    />
                  </Col>
                </Col>
              </Row>
            </Modal>
            <Col xs={24}>
              <p className="text">
                Votre salaire d'embauche : {salary} bruts annuel
              </p>
            </Col>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'center' }}>
            <Col xs={24}>
              <p className="text">
                Bravo {username} ! C'était un entretien rondement mené !
              </p>
              <Image src={MikeChickenLeft} width={50} preview={false} />
            </Col>
            <Col xs={24}>
              <p className="text">Vous devriez vous perfectionner sur : </p>
            </Col>
            <Col xs={24}>
              {categoriesScores.map(
                (categoriescore) =>
                  categoriescore.numberPointsFalse >= 6 && (
                    <p className="text">{categoriescore.category}</p>
                  )
              )}
            </Col>
            <Row
              style={{
                justifyContent: 'center',
              }}
            >
              <Col xs={24} style={{ marginBottom: '8px' }}>
                <Button
                  onClick={() => setLoadingAdvices(true)}
                  loading={loadingAdvices ? true : false}
                >
                  Voir les conseils
                </Button>
              </Col>
              <Col xs={24} style={{ marginBottom: '8px' }}>
                <Button
                  onClick={() => setLoadingInterviewHomepage(true)}
                  loading={loadingInterviewHomepage ? true : false}
                >
                  Refaire un entretien !
                </Button>
              </Col>
            </Row>
            <Col xs={24}>
              <Button
                type="primary"
                onClick={() => {
                  setIsModalTwoVisible(true);
                  handleSubmitNewTrophy();
                }}
              >
                Suivant
              </Button>
            </Col>
            <Modal
              title="Récompense"
              visible={isModalTwoVisible}
              onOk={() => {
                handleOkModalTwo();
                setLoadingAccountPage(true);
              }}
              onCancel={handleCancelModalTwo}
            >
              <Row style={{ textAlign: 'center' }}>
                <Col xs={24}>
                  <p className="title-alt">
                    Vous avez gagné le trophée {'\n'} {lastTrophy.name}
                  </p>
                </Col>
                <Col xs={24}>
                  <Image
                    src={trophy}
                    alt="trophypic"
                    preview={false}
                    width={200}
                  />
                </Col>
                <Col xs={24}>
                  <p className="text">{listErrorsNewTrophy}</p>
                </Col>
              </Row>
            </Modal>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    username: state.username,
    score: state.score,
    detailedscore: state.detailedscore,
    job: state.job,
    county: state.county,
  };
}

export default connect(mapStateToProps, null)(ResultPage);
