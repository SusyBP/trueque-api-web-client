import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Accordion } from 'react-bootstrap';
import { useHistory } from 'react-router';

const apiUri = 'http://nayhanapl-001-site1.etempurl.com';
const apiLocal = 'https://localhost:44395';

const MisTrueques = () => {
    const [trueques, setTrueques] = useState([]);
    const history = useHistory();

    useEffect(() => {
        // let id = localStorage.getItem('id');
        fecthTrueques();
        return () => {
            //clean up

        }
    }, []);

    async function fecthTrueques() {
        try {
            let user = localStorage.getItem('user');
            if(user===null){history.push('/entrar'); return;}
            let data = JSON.parse(user);
            [user] = data
            let res = await fetch(
                `${apiUri}/GetTablaTrueque?id=${user.id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            )
            if (res.status !== 200) { return; }
            const json = await res.json();
            setTrueques(json);
        }
        catch (e) {
            alert(e)
        }
    }
    return (
        trueques?.map((t, index) => <Accordion>
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey={`${index}`}>
                        {` ${t.fecha} ${t.tipo}`}
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={`${index}`}>
                    <Card.Body>{t.pro && 'Propongo: ' + t.pro}<br />
                        {t.bus && 'Busco: ' + t.bus}</Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        ))

}

export default MisTrueques;
