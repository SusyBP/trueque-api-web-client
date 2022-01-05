import React from 'react'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './auth.css';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Spinner, DropdownButton, Dropdown, Container, Row, Col } from 'react-bootstrap';
import Axios from 'axios';
import { sha256 } from 'js-sha256';

const apiUri = 'http://nayhanapl-001-site1.etempurl.com';
const apiLocal = 'https://localhost:44395';

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [address, setAddress] = useState();
    const [province, setProvince] = useState();
    const [cellphoneNum, setCellphoneNum] = useState();
    const [landlineNum, setLandlineNum] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirmation, setPasswordConfirmation] = useState();

    const history = useHistory();

    const provinces = ['La Habana', 'Mayabeque', 'Artemisa', 'Pinar del Río'];

    async function register() {
        try {
            if (password !== passwordConfirmation) {
                alert('Las contraseñas no coinciden, rectifique');
                setPasswordConfirmation('');
                return -1;
            }
            const encript = sha256(password);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: name,
                    apellido: lastName,
                    numMovil: cellphoneNum,
                    numFijo: landlineNum,
                    correo: email,
                    provincia: province,
                    dirección: address,
                    clave: encript,
                })
            };
            let response = await fetch(`${apiLocal}/api/persona`, requestOptions);
            const data = await response.json();
            //console.log(data);
            return 0;
        }
        catch (e) {
            alert(e)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setIsLoading((prevValue) => !prevValue);
            const res = await register();
            setIsLoading((prevValue) => !prevValue);
            if(res===0){history.push('/entrar');}
            
        }
        catch (e) {
            setIsLoading((prevValue) => !prevValue);
            alert(e);
        }
    }
    const handleSelect = (e)=>{
        let province = provinces[e];
        setProvince(province);
    }
    return (
        <Container>
            <form className='container' onSubmit={handleSubmit}>
                <h3>Registrarse</h3>
                <Row>
                    <Col sm={6}>
                        <div className='form-group'>
                            <label>Nombre</label>
                            <input onChange={(e) => { setName(e.target.value) }} className='form-control' type='text' placeholder='Nombre'></input>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className='form-group'>
                            <label>Apellidos</label>
                            <input onChange={(e) => { setLastName(e.target.value) }} className='form-control' type='text' placeholder='Apellidos'></input>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <div className='form-group'>
                            <label>Correo</label>
                            <input onChange={(e) => { setEmail(e.target.value) }} className='form-control' type='email' placeholder='Correo'></input>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className='form-group'>
                            <label>Dirección</label>
                            <input onChange={(e) => { setAddress(e.target.value) }} className='form-control' type='text' placeholder='Dirección'></input>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <div className='form-group'>
                            <label>Número Móvil</label>
                            <input onChange={(e) => { setCellphoneNum(e.target.value) }} className='form-control' type='text' placeholder='Número Móvil'></input>
                        </div>
                    </Col>
                    <Col sm={4}>
                        <div className='form-group'>
                            <label>Número Fijo</label>
                            <input onChange={(e) => { setLandlineNum(e.target.value) }} className='form-control' type='text' placeholder='Número Fijo'></input>
                        </div>
                    </Col>
                    <Col sm={4}>
                        <div className='form-group'>
                            <label>Provincia</label>
                            <DropdownButton onSelect={ handleSelect }
                                id='dropdown-basic-button'
                                // variant={variant.toLowerCase()}
                                title='Provincias'
                            >
                                {provinces.map(
                                    (province, index) =>
                                        <>
                                            <Dropdown.Item key={index} eventKey={index}>{province}</Dropdown.Item>
                                            {index < provinces.length && <Dropdown.Divider />}
                                        </>
                                )}
                            </DropdownButton>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <div className='form-group'>
                            <label>Contraseña</label>
                            <input onChange={(e) => { setPassword(e.target.value) }} className='form-control' type='password' placeholder='Contraseña'></input>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className='form-group'>
                            <label>Confirmar contraseña</label>
                            <input onChange={(e) => { setPasswordConfirmation(e.target.value) }} className='form-control' type='password' placeholder='Confirmar contraseña'></input>
                        </div>
                    </Col>
                </Row>

                <Button onClick={handleSubmit} className='btn btn-primary btn-block' variant="primary">
                    {isLoading && <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />}
                    {isLoading ? 'Espere...' : 'Registrarme'}
                </Button>
            </form>
        </Container>
    )
}

export default Register
