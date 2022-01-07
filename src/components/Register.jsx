import React, {useEffect} from 'react'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './auth.css';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Spinner, DropdownButton, Dropdown, Container, Row, Col } from 'react-bootstrap';
import Axios from 'axios';
import { sha256 } from 'js-sha256';
import FormErrors from './FormErrors';

const apiUri = 'http://nayhanapl-001-site1.etempurl.com';
const apiLocal = 'https://localhost:44395';

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);

    // const [name, setName] = useState();
    // const [lastName, setLastName] = useState();
    // const [email, setEmail] = useState();
    // const [address, setAddress] = useState();
    // const [province, setProvince] = useState();
    // const [cellphoneNum, setCellphoneNum] = useState();
    // const [landlineNum, setLandlineNum] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirmation, setConfirmationPassword] = useState();

    const [user, setUser] = useState({
        id: '', nombre: '', apellido: '', correo: '', direccion: '',
        numMovil: '', numFijo: '', provincia: '', token: ''
    });

    const [formErrors, setFormErrors] = useState({email: '', password:'', cellphoneNum:'', landlineNum:'', address:''});
    const [isformValid, setIsFormValid] = useState(false);
    const [validations, setValidations] = useState({isEmailValid: false, isPasswordValid: false});

    const history = useHistory();

    const provinces = ['La Habana', 'Mayabeque', 'Artemisa', 'Pinar del Río', 'Matanzas'];

    async function register() {
        try {
            if (password !== passwordConfirmation) {
                alert('Las contraseñas no coinciden, rectifique');
                setConfirmationPassword('');
                return -1;
            }
            const encript = sha256(password);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: user.nombre,
                    apellido: user.apellido,
                    numMovil: user.numMovil,
                    numFijo: user.numFijo,
                    correo: user.correo,
                    provincia: user.provincia,
                    dirección: user.direccion,
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
            if (res === 0) { history.push('/entrar'); }

        }
        catch (e) {
            setIsLoading((prevValue) => !prevValue);
            alert(e);
        }
    }
    const handleSelect = (e) => {
        let province = provinces[e];
        setUser(prev => ({...prev, provincia: province}));
    }


    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        switch (name) {
            case 'name':
                setUser(prev => ({ ...prev, nombre: value }), () => { });
                break;
            case 'lastName':
                setUser(prev => ({ ...prev, apellido: value }));
                break;
            case 'cellphoneNum':
                setUser(prev => ({ ...prev, numMovil: value }));
                break;
            case 'landlineNum':
                setUser(prev => ({ ...prev, numFijo: value }));
                break;
            case 'email':
                setUser(prev => ({ ...prev, correo: value }));
                break;
            case 'address':
                setUser(prev => ({ ...prev, direccion: value }));
                break;
            case 'password':
                setPassword(value);
                break;
            case 'passwordConfirmation':
                setConfirmationPassword(value);
                break;
            default:
                break;
        }
        validateField(name, value);
    }

    const validateField = (fieldName, value) => {
        let fieldValidationErrors = formErrors;
        let emailValid = validations.emailValid;
        let passwordValid = validations.passwordValid;
      
        switch(fieldName) {
          case 'email':
            emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
            fieldValidationErrors.email = emailValid ? '' : ' is invalid';
            break;
          case 'password':
            passwordValid = value.length >= 6;
            fieldValidationErrors.password = passwordValid ? '': ' is too short';
            break;
          default:
            break;
        }
        setFormErrors(fieldValidationErrors);
        setValidations({emailValid: emailValid, passwordValid: passwordValid});
        validateForm();
      }

      const validateForm = () => {
        setIsFormValid(validations.isEmailValid && validations.isPasswordValid);
      }

    //   useEffect(() => {
    //       validateForm();
    //       return () => {
    //         //   cleanup
    //       }
    //   }, [user])
    return (
        <Container>
            <FormErrors formErrors={formErrors}/>
            <form className='container' onSubmit={handleSubmit}>
                <h3>Registrarse</h3>
                <Row>
                    <Col sm={6}>
                        <div className='form-group'>
                            <label>Nombre</label>
                            <input value={user.nombre} name='name' onChange={handleOnChange} className='form-control' type='text' placeholder='Nombre'></input>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className='form-group'>
                            <label>Apellidos</label>
                            <input value={user.apellido} name='lastName' onChange={handleOnChange} className='form-control' type='text' placeholder='Apellidos'></input>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <div className='form-group'>
                            <label>Correo</label>
                            <input value={user.correo} name='email' onChange={handleOnChange} className='form-control' type='email' placeholder='Correo'></input>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className='form-group'>
                            <label>Dirección</label>
                            <input value={user.direccion} name='address' onChange={handleOnChange} className='form-control' type='text' placeholder='Dirección'></input>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <div className='form-group'>
                            <label>Número Móvil</label>
                            <input value={user.numMovil} name='cellPhoneNum' onChange={handleOnChange} className='form-control' type='text' placeholder='Número Móvil'></input>
                        </div>
                    </Col>
                    <Col sm={4}>
                        <div className='form-group'>
                            <label>Número Fijo</label>
                            <input value={user.numFijo} name='landlineNum' onChange={handleOnChange} className='form-control' type='text' placeholder='Número Fijo'></input>
                        </div>
                    </Col>
                    <Col sm={4}>
                        <div className='form-group'>
                            <label>Provincia</label>
                            <DropdownButton onSelect={handleSelect}
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
                            <input name='password' value={password} onChange={handleOnChange} className='form-control' type='password' placeholder='Contraseña'></input>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className='form-group'>
                            <label>Confirmar contraseña</label>
                            <input name='confirmationPassword' value={passwordConfirmation} onChange={handleOnChange} className='form-control' type='password' placeholder='Confirmar contraseña'></input>
                        </div>
                    </Col>
                </Row>

                <Button desabled={isformValid} onClick={handleSubmit} className='btn btn-primary btn-block' variant="primary">
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

export default Register;