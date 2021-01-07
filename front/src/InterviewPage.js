import React, { useState, useEffect } from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import { Button, Card, Col, Image, Modal, Progress, Row, Skeleton } from 'antd';
import { connect } from 'react-redux';
import Nav from './Nav';
import MikeChickenSmall from './images/MikeChickenSmall.png';
import AgentToufSmall from './images/AgentToufSmall.png';

function InterviewPage({
  username,
  onSubmitLastScore,
  onSubmitDetailedScore,
  icop,
}) {
  const [questionNumber, setQuestionNumber] = useState(1); //compteur des questions affiché sur la top bar entretien
  const [questionList, setQuestionList] = useState(); //stocke les données des questions envoyées par le back (questions,réponses,conseils etc)

  const [tempScore, setTempScore] = useState(0); //score temporaire associé à la réponse actuellement sélectionnée (pas encore confirmée par le user)

  const [score, setScore] = useState([]); //lorsque la réponse est confirmée par le user, le score final est incrémenté
  const [category, setCategory] = useState([]); //lorsque la réponse est confirmée par le user, la liste des categories de questions est enregistrée (pour envoi dans redux à la fin)

  //états liés aux réponses, un état passe à true si la réponse associée est sélectionnée par le user
  const [answerA, setAnswerA] = useState(false);
  const [answerB, setAnswerB] = useState(false);
  const [answerC, setAnswerC] = useState(false);
  const [answerD, setAnswerD] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [loading, setLoading] = useState(false); //état lié à l'indicateur de chargement lorsqu'on clique sur un bouton
  const [loadingResult, setLoadingResult] = useState(false); //état lié à l'indicateur de chargement lorsqu'on clique sur le bouton "Suivant"

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //charge les questions (générées aléatoirement par le backend)
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`/generate-questions?icop=${icop}`);
      const body = await data.json();
      if (body.result === true) {
        setQuestionList(body.questionsArray);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  //déclenche handleSubmitLastQuestion après la dernière question
  useEffect(() => {
    score.length === 10 && handleSubmitLastQuestion();
    // eslint-disable-next-line
  }, [score]);

  //mécanique lorsque le user choisit une réponse
  const handleSelectedAnswer = (order, points) => {
    if (order === 'A') {
      setAnswerA(true);
      setAnswerB(false);
      setAnswerC(false);
      setAnswerD(false);
    } else if (order === 'B') {
      setAnswerA(false);
      setAnswerB(true);
      setAnswerC(false);
      setAnswerD(false);
    } else if (order === 'C') {
      setAnswerA(false);
      setAnswerB(false);
      setAnswerC(true);
      setAnswerD(false);
    } else {
      setAnswerA(false);
      setAnswerB(false);
      setAnswerC(false);
      setAnswerD(true);
    }
    // console.log('cette réponse vaut '+points+' points');
    setTempScore(points);
  };

  //mécanique qui incrémente le score et charge la question suivante
  const handleNextQuestion = (newCategory) => {
    setIsModalVisible(false);
    if (answerA || answerB || answerC || answerD) {
      //vérification qu'une réponse a bien été sélectionnée par l'utilisateur
      setScore([...score, tempScore]); //enregistrement du score
      setCategory([...category, newCategory]);
      questionNumber < 10 && setQuestionNumber((prev) => prev + 1); //incrémente le compteur des questions
      //réinitialisation des états liés aux réponses
      setAnswerA(false);
      setAnswerB(false);
      setAnswerC(false);
      setAnswerD(false);
    }
  };

  // //envoi du score et du username au back à la fin de l'entretien (une fois la question 10 validée)
  const handleSubmitLastQuestion = async () => {
    setLoading(true);
    const finalScore = score.reduce((a, b) => a + b, 0);
    const data = await fetch(`/interviewsave-scoreandtrophy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `usernameFromFront=${username}&scoreFromFront=${finalScore}`,
    });
    const body = await data.json();
    if (body.result === true) {
      onSubmitLastScore(finalScore); //envoie le score total dans redux
      onSubmitDetailedScore({ score, category }); //envoie le resultat de chaque question dans redux
      setLoadingResult(true);
    }
  };

  if (loadingResult) {
    return <Redirect to="/resultpage" />;
  }

  if (!questionList) {
    return <Skeleton />;
  }

  let questionDisplay = questionList[questionNumber - 1]; //lorsque le compteur des questions s'actualise, la question suivante est chargée

  return (
    <div>
      <Nav />

      <Row
        gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
        style={{ marginTop: '8px' }}
      >
        <Col xs={24} style={{ textAlign: 'center' }} className="title">
          <Progress
            type="circle"
            percent={questionNumber * 10}
            format={(percent) => `${percent / 10} / 10`}
            width={90}
          />
        </Col>
      </Row>

      <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        <Col xs={24} style={{ textAlign: 'center' }} className="title">
          <p> {questionDisplay.question} </p>
        </Col>
      </Row>

      <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        <Col
          xs={24}
          md={12}
          lg={6}
          style={{ textAlign: 'center' }}
          className="text-alt"
        >
          <Card
            onClick={() =>
              handleSelectedAnswer('A', questionDisplay.answers[0].points)
            }
            className={answerA ? 'Selected' : 'Unselected'}
            hoverable
            style={{ marginLeft: '8px' }}
          >
            <p>{questionDisplay.answers[0].text}</p>
          </Card>
        </Col>
        <Col
          xs={24}
          md={12}
          lg={6}
          style={{ textAlign: 'center' }}
          className="text-alt"
        >
          <Card
            onClick={() =>
              handleSelectedAnswer('B', questionDisplay.answers[1].points)
            }
            className={answerB ? 'Selected' : 'Unselected'}
            hoverable
          >
            <p>{questionDisplay.answers[1].text}</p>
          </Card>
        </Col>
        <Col
          xs={24}
          md={12}
          lg={6}
          style={{ textAlign: 'center' }}
          className="text-alt"
        >
          <Card
            onClick={() =>
              handleSelectedAnswer('C', questionDisplay.answers[2].points)
            }
            className={answerC ? 'Selected' : 'Unselected'}
            hoverable
          >
            <p>{questionDisplay.answers[2].text}</p>
          </Card>
        </Col>
        <Col
          xs={24}
          md={12}
          lg={6}
          style={{ textAlign: 'center' }}
          className="text-alt"
        >
          <Card
            onClick={() =>
              handleSelectedAnswer('D', questionDisplay.answers[3].points)
            }
            className={answerD ? 'Selected' : 'Unselected'}
            hoverable
            style={{ marginRight: '8px' }}
          >
            <p>{questionDisplay.answers[3].text}</p>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={20}
          offset={2}
          style={{ textAlign: 'center' }}
          className="text"
        >
          <Button
            type="primary"
            className="Input"
            onClick={() => {
              showModal();
            }}
            loading={loading === true ? true : false}
          >
            Valider
          </Button>
          <Modal
            title="Conseil"
            visible={isModalVisible}
            onOk={() => handleNextQuestion(questionDisplay.category)}
            onCancel={handleCancel}
          >
            <Row className="text-alt">
              <Col xs={24} style={{ textAlign: 'center' }}>
                <Image
                  src={
                    icop === 'MikeChicken' ? MikeChickenSmall : AgentToufSmall
                  }
                  alt="iCopPic"
                  preview={false}
                  width={200}
                />
              </Col>
              <Col xs={24}>
                <p>{questionDisplay.advice}</p>
              </Col>
            </Row>
          </Modal>
        </Col>
      </Row>
    </div>
  );
}

function mapStateToProps(state) {
  return { username: state.username, icop: state.icop };
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmitLastScore: function (score) {
      dispatch({ type: 'saveLastScore', score });
    },
    onSubmitDetailedScore: function (detailedScore) {
      dispatch({ type: 'saveDetailedScore', detailedScore });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InterviewPage);
