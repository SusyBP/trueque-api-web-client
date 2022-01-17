import React, { useState, useRef } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Button, Spinner } from 'react-bootstrap';
import { sha256 } from 'js-sha256';

import './auth.css';
//import axios from 'axios';
import { useHistory } from 'react-router';

const apiUri = 'http://nayhanapl-001-site1.etempurl.com';
const apiLocal = 'https://localhost:44395';


const Login = (props) => {

    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const history = useHistory();

    const [userLocal, setUserLocal] = useState({
        id: '', nombre: '', apellido: '', correo: '', direccion: '',
        numMovil: '', numFijo: '', provincia: '', token: ''
    });

    const saveProfile = profileData => {
        if (profileData === null || typeof profileData === 'undefined') return;

        setToken(token);
        localStorage.setItem('user', JSON.stringify(profileData));
        setUserLocal(profileData);
        props.setUser(profileData);

    };

    async function login() {
        let encript = sha256(token);
        let res = await fetch(
            `${apiUri}/api/login?nombre=${userLocal.nombre}&clave=${encript}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
        if (res.status !== 200) { return -1; }
        const json = await res.json();
        saveProfile(json);//array
        return 0;
    }
    const handleSubmit = async e => {
        try {
            e.preventDefault();
            setIsLoading((prevValue) => !prevValue)
            const res = await login();
            setIsLoading((prevValue) => !prevValue);
            if(res===-1){ alert('Nombre de usuario y/o contraseña inválidos'); return;}
            history.push('/perfil');           
        }
        catch (e) {
            setIsLoading((prevValue) => !prevValue);
            alert(`método Login/handlesubmmit: ${e}`);
        }
    }

    
    const handleOnChangeName = (e) => {
        setUserLocal(p => ({ ...p, nombre: e.target.value }))
        //props.setUser()
    }
    return (
        <form >
            <h3>Entrar</h3>
            <div className='form-group'>
                <label>Nombre</label>
                <input onChange={handleOnChangeName} className='form-control' type='text' placeholder='Nombre'></input>
            </div>
            <div className='form-group'>
                <label>Contraseña</label>
                <input onChange={(e) => { setToken(e.target.value) }} className='form-control' type='password' placeholder='Contraseña'></input>
            </div>
            <div className='form-group'>
                <Button onClick={handleSubmit} className='btn btn-primary btn-block' variant="primary">
                    {isLoading && <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />}
                    {isLoading ? 'Espere...' : 'Entrar'}
                </Button>
            </div>
           
        </form>
    )
}

export default Login;
