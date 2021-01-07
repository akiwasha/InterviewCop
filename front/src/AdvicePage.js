import React, { useState, useEffect } from 'react';
import './App.css';
import { Col, Collapse, Row, Skeleton } from 'antd';
import Nav from './Nav';

const { Panel } = Collapse;

function AdvicePage() {
  //déclenche le setAdvices au chargement de la page pour récupérer les conseils stockés en BDD
  const [advices, setAdvices] = useState();

  useEffect(() => {
    const getAdvices = async () => {
      const data = await fetch(`/advices`);
      const body = await data.json();
      if (body.result === true) {
        setAdvices(body.advices);
      }
    };
    getAdvices();
  }, []);

  if (!advices) {
    return <Skeleton />;
  }

  let advicesList = advices.map((e, i) => (
    <Col className="title">
      <Collapse accordion>
        <Panel header={e.title} key={i}>
          <p className="text-alt">{e.content}</p>
        </Panel>
      </Collapse>
    </Col>
  ));

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
        {advicesList}
      </Row>
    </div>
  );
}

export default AdvicePage;
