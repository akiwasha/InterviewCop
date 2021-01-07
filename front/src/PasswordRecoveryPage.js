import React, { useState } from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import { Button, Col, Image, Input, message, Row, Select } from 'antd';
import { connect } from 'react-redux';
import MikeChickenSmall from './images/MikeChickenSmall.png';
import AgentToufSmall from './images/AgentToufSmall.png';

function PasswordRecoveryPage({ onSubmitUsername }) {
  const [username, setUsername] = useState('');
  const [secretQuestion, setSecretQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [listErrorsPasswordRecovery, setListErrorsPasswordRecovery] = useState(
    []
  ); //les messages d'erreur sont transmis par le Back
  const [listErrorsNewPassword, setListErrorsNewPassword] = useState([]); //les messages d'erreur sont transmis par le Back

  const [userQuestionAndAnswer, setUserQuestionAndAnswer] = useState(false); //état lié à la vérification de la question secrète choisie et la réponse du user dans la BDD
  const [PasswordChange, setPasswordChange] = useState('');

  const [loadingHomePage, setLoadingHomePage] = useState(false); //état lié à l'indication de chargement sur le bouton du nouveau mot de passe

  const { Option } = Select;

  //Process PasswordRecovery : se déclenche via le bouton valider de la récupération de mot de passe
  //interroge la BDD via le Back, le Back vérifie que la question secrète choisie et la réponse correspondent au User et renvoie un message d'erreur le cas échéant
  const handleSubmitPasswordRecovery = async () => {
    const data = await fetch(`/password-recovery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `usernameFromFront=${username}&secret_questionFromFront=${secretQuestion}&secret_question_answerFromFront=${answer}`,
    });

    const body = await data.json();

    console.log(username);
    console.log(secretQuestion);
    console.log(answer);

    if (body.result === true) {
      setUserQuestionAndAnswer(true);
    } else {
      setListErrorsPasswordRecovery(body.error);
    }
  };

  let newPasswordView;
  if (userQuestionAndAnswer) {
    newPasswordView = (
      <Col
        xs={24}
        className="Sign"
        // style={{ textAlign: 'center', marginTop: '20px', marginRight: '8px' }}
      >
        <Input.Password
          onChange={(e) => setPasswordChange(e.target.value)}
          className="Login-input"
          placeholder="Nouveau mot de passe"
          style={{ marginRight: '8px', marginBottom: '8px' }}
        />
        <Button
          className="button"
          onClick={() => handleSubmitNewPassword()}
          type="primary"
          loading={loadingHomePage === true ? true : false}
          style={{ marginRight: '8px', marginBottom: '8px' }}
        >
          Valider
        </Button>
      </Col>
    );
  }

  //Process NewPassword : se déclenche via le bouton valider du nouveau mot de passe
  //modifie le password de la BDD via le Back
  const handleSubmitNewPassword = async () => {
    const data = await fetch(`/new-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `usernameFromFront=${username}&newPasswordFromFront=${PasswordChange}`,
    });

    const body = await data.json();

    if (body.result === true) {
      onSubmitUsername(username);
      message.success('Votre mot de passe a bien été modifié!');
      setLoadingHomePage(true);
    } else {
      setListErrorsNewPassword(body.error);
    }
  };

  //fonction rattachée à la sélection de question secrète
  const handleChange = (value) => {
    setSecretQuestion(value);
  };

  if (loadingHomePage) {
    return <Redirect to="/homepage" />;
  }

  return (
    <div>
      <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        <Col
          xs={24}
          className="Sign"
          style={{ textAlign: 'center', marginTop: '20px' }}
        >
          <Col xs={12}>
            <Image
              src={MikeChickenSmall}
              alt="iCopPic"
              preview={false}
              width={150}
            />
            <Image
              src={AgentToufSmall}
              alt="iCopPic"
              preview={false}
              width={150}
            />
          </Col>
          <p className="title">
            Bienvenue sur InterviewCop, l'application qui vous entraîne aux
            entretiens d'embauche.
          </p>
        </Col>
      </Row>

      <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        <Col xs={24} className="Sign">
          <p className="title">Réinitialisation du mot de passe</p>

          <Input
            onChange={(e) => setUsername(e.target.value)}
            className="Login-input"
            placeholder="nom d'utilisateur"
            style={{ marginRight: '8px', marginBottom: '8px' }}
          />

          <Select
            placeholder="Choisissez une question secrète"
            className="Login-input"
            onChange={handleChange}
            style={{ marginRight: '8px', marginBottom: '8px' }}
          >
            <Option value="Quel est le nom de votre premier animal de compagnie?">
              Quel est le nom de votre premier animal de compagnie?
            </Option>
            <Option value="Quelle est la date de naissance de votre mère?">
              Quelle est la date de naissance de votre mère?
            </Option>
            <Option value="Quel est votre plat favori?">
              Quel est votre plat favori?
            </Option>
          </Select>

          <Input
            onChange={(e) => setAnswer(e.target.value)}
            className="Login-input"
            placeholder="réponse"
            style={{ marginRight: '8px', marginBottom: '8px' }}
          />
          <p>{listErrorsPasswordRecovery}</p>

          <Button
            className="button"
            onClick={() => handleSubmitPasswordRecovery()}
            type="primary"
            style={{ marginRight: '8px', marginBottom: '8px' }}
          >
            Valider
          </Button>
        </Col>
        {newPasswordView}
        <p>{listErrorsNewPassword}</p>
      </Row>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmitUsername: function (username) {
      dispatch({ type: 'saveUsername', username });
    },
  };
}

export default connect(null, mapDispatchToProps)(PasswordRecoveryPage);
