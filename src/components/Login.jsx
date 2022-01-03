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
    const [newPassword, setNewPassword] = useState('');

    const [changePass, setChangePass] = useState(false);
    const [isLoadingCP, setIsLoadingCP] = useState(false);
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
        props.setUser([profileData]);

    };

    async function login() {
        let encript = sha256(token);
        let res = await fetch(
            `${apiLocal}/api/login?nombre=${userLocal.nombre}&clave=${encript}`,
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
        saveProfile(json);
    }
    const handleSubmit = async e => {
        try {
            e.preventDefault();
            setIsLoading((prevValue) => !prevValue)
            const profileData = await login();
            setIsLoading((prevValue) => !prevValue);
            if (profileData !== -1) {
                history.push('/perfil');
            }
            else { window.alert('Error de conexión, vuelva a intentar'); }
        }
        catch (e) {
            setIsLoading((prevValue) => !prevValue);
            alert(e);
        }
    }

    async function changePassword() {
        const encript = sha256(newPassword);
        const item = localStorage.getItem('user');
        if (item === null) { alert('Debe entrar para poder cambiar su contraseña'); return; }
        let json = JSON.parse(item);
        let [currentUser] = json; 
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: currentUser.id,
                clave: encript
            })
        };
        let response = await fetch(`${apiLocal}/SaveUpClave`, requestOptions);
        if (response.status !== 200) { alert(`an error has occurred: ${response.statusText}`); return; }
        const data = await response.json();
        return data;
    }

    const handleChangePassword = async e => {
        e.preventDefault();
        setIsLoadingCP((prev) => !prev)
        await changePassword();
        let item = localStorage.getItem('user');
        if (item !== null) {
            let json = JSON.parse(item);
            let [userData] = json;
            userData.clave = sha256(newPassword);
            localStorage.setItem('user', JSON.stringify(userData));
        }
        setChangePass((prev) => !prev);
        setIsLoadingCP((prev) => !prev);
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
            <a onClick={() => { setChangePass(p => !p) }}>Cambiar contraseña</a>
            {changePass && <><div className='form-group'>

                <input onChange={(e) => { setToken(e.target.value) }} className='form-control' type='password' placeholder='Contraseña anterior'></input>
            </div>
                <div className='form-group'>
                    <label>Nueva contraseña</label>
                    <input onChange={(e) => { setNewPassword(e.target.value) }} className='form-control' type='password' placeholder='Nueva contraseña'></input>
                </div>
                <div className='form-group'>
                    <Button onClick={handleChangePassword} className='btn btn-primary btn-block' variant="primary">
                        {isLoadingCP && <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />}
                        {isLoadingCP ? 'Espere...' : 'Cambiar'}
                    </Button>
                </div></>}
        </form>
    )
}

export default Login;
