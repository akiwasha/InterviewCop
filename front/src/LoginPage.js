import React, { useState } from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import { Button, Col, Image, Input, Row, Select } from 'antd';
import { connect } from 'react-redux';
import MikeChickenSmall from './images/MikeChickenSmall.png';
import AgentToufSmall from './images/AgentToufSmall.png';

function LoginScreen({ onSubmitUsername }) {
  //états liés au Sign-Up
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [secretQuestion, setSecretQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [listErrorsSignup, setListErrorsSignup] = useState([]); //les messages d'erreur sont transmis par le Back

  //états liés au Sign-In
  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [listErrorsSignin, setListErrorsSignin] = useState([]); //les messages d'erreur sont transmis par le Back

  const [userExists, setUserExists] = useState(false); //état lié à la vérification de l'existence du user dans la BDD

  const [loading, setLoading] = useState(false); //état lié à l'indicateur de chargement lorsqu'on clique sur un bouton

  const { Option } = Select;

  //Process SignUp : se déclenche via le bouton connecter du "pas encore de compte?"
  //interroge la BDD via le Back, le Back vérifie que le user est bien créé dans la BDD et renvoie un message d'erreur le cas échéant
  const handleSubmitSignup = async () => {
    setLoading(true);
    const data = await fetch(`/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `usernameFromFront=${signUpUsername}&passwordFromFront=${signUpPassword}&secret_question=${secretQuestion}&secret_question_answer=${answer}`,
    });

    const body = await data.json();

    if (body.result === true) {
      setUserExists(true);
      onSubmitUsername(signUpUsername);
    } else {
      setListErrorsSignup(body.error);
      setLoading(false);
    }
  };

  //Process SignIn : se déclenche via le bouton connecter du "déjà un compte?"
  //interroge la BDD via le Back, le Back vérifie que le user existe dans la BDD et renvoie un message d'erreur le cas échéant
  const handleSubmitSignin = async () => {
    setLoading(true);
    const data = await fetch(`/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `usernameFromFront=${signInUsername}&passwordFromFront=${signInPassword}`,
    });

    const body = await data.json();

    if (body.result === true) {
      setUserExists(true);
      onSubmitUsername(signInUsername);
    } else {
      setListErrorsSignin(body.error);
      setLoading(false);
    }
  };

  //fonction rattachée à la sélection de question secrète
  const handleChange = (value) => {
    setSecretQuestion(value);
  };

  if (userExists) {
    return <Redirect to="/homepage" />;
  }

  var tabErrorsSignin = listErrorsSignin.map((error, i) => {
    return <p key={i}>{error}</p>;
  });

  var tabErrorsSignup = listErrorsSignup.map((error, i) => {
    return <p key={i}>{error}</p>;
  });

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
        {/* SIGN-IN */}

        <Col xs={24} className="Sign">
          <p className="title">Déjà un compte ?</p>

          <Input
            onChange={(e) => setSignInUsername(e.target.value)}
            className="Login-input"
            placeholder="nom d'utilisateur"
            style={{ marginLeft: '8px', marginBottom: '8px' }}
          />

          <Input.Password
            onChange={(e) => setSignInPassword(e.target.value)}
            className="Login-input"
            placeholder="mot de passe"
            style={{ marginLeft: '8px', marginBottom: '8px' }}
          />

          {tabErrorsSignin}

          <Button
            className="button"
            onClick={() => handleSubmitSignin()}
            type="primary"
            loading={loading === true ? true : false}
            style={{ marginLeft: '8px', marginBottom: '8px' }}
          >
            Se connecter
          </Button>

          <a
            href="/password-recovery"
            className="text-italic"
            style={{ marginLeft: '8px', marginBottom: '8px' }}
          >
            Mot de passe oublié ?
          </a>
        </Col>
        {/* SIGN-UP */}

        <Col xs={24} className="Sign">
          <p style={{ marginRight: '8px' }} className="title">
            Pas encore de compte ?
          </p>

          <Input
            onChange={(e) => setSignUpUsername(e.target.value)}
            className="Login-input"
            placeholder="nom d'utilisateur"
            style={{ marginRight: '8px', marginBottom: '8px' }}
          />

          <Input.Password
            onChange={(e) => setSignUpPassword(e.target.value)}
            className="Login-input"
            placeholder="mot de passe"
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

          {tabErrorsSignup}

          <Button
            className="button"
            onClick={() => handleSubmitSignup()}
            type="primary"
            loading={loading === true ? true : false}
            style={{ marginRight: '8px', marginBottom: '8px' }}
          >
            Se connecter
          </Button>
        </Col>
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

export default connect(null, mapDispatchToProps)(LoginScreen);
