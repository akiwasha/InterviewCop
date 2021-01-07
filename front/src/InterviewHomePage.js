import React, { useState } from 'react';
import './App.css';
import { Redirect } from 'react-router-dom';
import { Button, Col, Image, Input, Modal, Row, Select } from 'antd';
import { connect } from 'react-redux';
import Nav from './Nav';
import MikeChicken from './images/MikeChickenRight.png';
import MikeChickenSmall from './images/MikeChickenSmall.png';
import AgentToufSmall from './images/AgentToufSmall.png';

const { Option } = Select;

function InterviewHomePage({
  username,
  onSubmitJob,
  onSubmitCounty,
  onSubmitIcop,
}) {
  const [loadingInterview, setLoadingInterview] = useState(false); //état lié à l'indicateur de chargement lorsqu'on clique sur le bouton "Suivant"
  const [job, setJob] = useState('');
  const [salary, setSalary] = useState('');
  const [county, setCounty] = useState('Choisissez votre région');
  const [icop, setIcop] = useState('Choisissez votre iCop');

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [listErrorsNewInformation, setListErrorsNewInformation] = useState(); //les messages d'erreur sont transmis par le Back

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //Process handleStartInterview : se déclenche via le bouton "suivant" après que l'utilisateur ait saisi les informations
  //ajoute ou modifie les données de l'utilisateur relatives à son métier, son salaire et sa région dans la BDD via le Back
  const handleStartInterview = async () => {
    const data = await fetch(`/update-userdata`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `usernameFromFront=${username}&jobFromFront=${job}&salaryFromFront=${salary}&countyFromFront=${county}`,
    });

    const body = await data.json();

    if (body.result === true) {
      onSubmitJob(job);
      onSubmitCounty(county);
      onSubmitIcop(icop);
      setLoadingInterview(true);
    } else {
      setListErrorsNewInformation(body.error);
    }
  };

  if (loadingInterview) {
    return <Redirect to="/interviewpage" />;
  }

  return (
    <div>
      <Nav />

      <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        <Col xs={24} md={12}>
          <Col
            xs={20}
            offset={2}
            style={{ textAlign: 'center' }}
            className="title"
          >
            Bonjour {username}! Ravi de vous rencontrer! Vous allez devoir
            répondre à une série de 10 questions!
          </Col>

          <Col xs={20} offset={2} style={{ textAlign: 'center' }}>
            <Image
              width={200}
              src={MikeChicken}
              alt="MikeChickenImg"
              preview={false}
            />
          </Col>
        </Col>

        <Col xs={24} md={12} style={{ alignSelf: 'center' }}>
          <Col
            xs={20}
            offset={2}
            style={{ textAlign: 'center' }}
            className="title"
          >
            Quelques infos sur vous
          </Col>

          <Col xs={20} offset={2} style={{ textAlign: 'center' }}>
            <Input
              onChange={(e) => setJob(e.target.value)}
              className="Input"
              placeholder="Métier recherché"
            />
          </Col>

          <Col xs={20} offset={2} style={{ textAlign: 'center' }}>
            <Input
              onChange={(e) => setSalary(e.target.value)}
              className="Input"
              placeholder="Salaire espéré"
            />
          </Col>

          <Col xs={20} offset={2} style={{ textAlign: 'center' }}>
            <Select
              defaultValue={county}
              className="Input"
              onChange={(value) => setCounty(value)}
            >
              <Option value="Auvergne-Rhone-Alpes">Auvergne-Rhone-Alpes</Option>
              <Option value="Bourgogne-Franche-Comte">
                Bourgogne-Franche-Comte
              </Option>
              <Option value="Bretagne">Bretagne</Option>
              <Option value="Centre-Val de Loire">Centre-Val de Loire</Option>
              <Option value="Corse">Corse</Option>
              <Option value="Grand Est">Grand Est</Option>
              <Option value="Hauts-de-France">Hauts-de-France</Option>
              <Option value="Ile-de-France">Ile-de-France</Option>
              <Option value="Normandie">Normandie</Option>
              <Option value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</Option>
              <Option value="Occitanie">Occitanie</Option>
              <Option value="Pays de la Loire">Pays de la Loire</Option>
              <Option value="Provence-Alpes-Cote d'Azur">
                Provence-Alpes-Cote d'Azur
              </Option>
              <Option value="DOM-TOM">DOM-TOM</Option>
            </Select>
          </Col>

          <Col xs={20} offset={2} style={{ textAlign: 'center' }}>
            <Button type="primary" onClick={showModal} className="Input">
              {icop}
            </Button>
            <Modal
              title="Choisissez votre iCop"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <Row className="text-alt">
                <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                  <Image
                    src={MikeChickenSmall}
                    alt="MikeChickenPic"
                    preview={false}
                    width={icop === 'MikeChicken' ? 250 : 200}
                    onClick={() => setIcop('MikeChicken')}
                  />
                  <p>Nom: Mike Chicken</p>
                  <p>Difficulté : Moyenne</p>
                </Col>
                <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                  <Image
                    src={AgentToufSmall}
                    alt="AgentToufPic"
                    preview={false}
                    width={icop === 'AgentTouf' ? 250 : 200}
                    onClick={() => setIcop('AgentTouf')}
                  />
                  <p>Nom: Agent Touf</p>
                  <p>Difficulté : Élevée</p>
                </Col>
              </Row>
            </Modal>
          </Col>

          {listErrorsNewInformation}

          <Col xs={20} offset={2} style={{ textAlign: 'center' }}>
            <Button
              className="button text"
              loading={loadingInterview === true ? true : false}
              onClick={() => handleStartInterview()}
            >
              Démarrer l'entretien!
            </Button>
          </Col>
        </Col>
      </Row>
    </div>
  );
}

function mapStateToProps(state) {
  return { username: state.username };
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmitJob: function (job) {
      dispatch({ type: 'saveJob', job });
    },
    onSubmitCounty: function (county) {
      dispatch({ type: 'saveCounty', county });
    },
    onSubmitIcop: function (icop) {
      dispatch({ type: 'saveIcop', icop });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InterviewHomePage);
