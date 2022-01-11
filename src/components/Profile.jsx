import React, { useState, useEffect } from 'react'
import { Tabs, Tab } from 'react-bootstrap';
import Login from './Login';
import Register from './Register';
import MisTrueques from './MisTrueques';
import { Button, Spinner, DropdownButton, Dropdown, Container, Row, Col, Image, InputGroup } from 'react-bootstrap';
import { useHistory } from 'react-router';

const Profile = () => {
    const history = useHistory();
    const [user, setUser] = useState({
        nombre: '', apellido: '', correo: '', direccion: '',
        provincia: '', numMovil: '', numFijo: ''
    });
    useEffect(() => {
        try {
            const item = localStorage.getItem('user');
            if (item !== null) {
                var [json] = JSON.parse(item);
                setUser(json);
            }
        }
        catch (e) {
            alert(`Profile/useEffect hook: ${e}`)
            history.push('/entrar');
        }
        //  return () => {
        //      cleanup
        //  }
    }, [])


    return (
        <div>
            <Row>
                {/* <Col md={4}> */}
                {/* <div>
                        <Image src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60' rounded fluid ></Image>
                        <Button className='file btn btn-lg btn-primary'>Cambiar Foto</Button>
                    </div> */}
                {/* </Col> */}
                <Col>
                    <Tabs defaultActiveKey="personalData" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="personalData" title="Datos Personales">
                            <div>
                                <Row>
                                    <Col>
                                        <h5>{`${user.nombre} ${user.apellido}`}</h5>
                                        {user.correo && <h6>Correo: {user.correo}</h6>}
                                        {user.direccion && <h6>Dirección: {user.direccion}</h6>}
                                        {user.numMovil && <h6>Teléfono: {user.numMovil}</h6>}
                                        {user.numFijo && <h6>Número fijo: {user.numFijo}</h6>}
                                        {user.provincia && <h6>Provincia: {user.provincia}</h6>}
                                    </Col>
                                </Row>
                            </div>
                        </Tab>
                        <Tab eventKey="misTrueques" title="Mis Trueques">
                            <div>
                                <Row>
                                    <Col>
                                        <MisTrueques />
                                    </Col>
                                </Row>
                            </div>
                        </Tab>
                    </Tabs>
                </Col>

            </Row>
        </div>
    )
}

export default Profile
