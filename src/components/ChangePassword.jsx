import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { sha256 } from 'js-sha256';
import { useHistory } from 'react-router';

function ChangePassword() {

    const apiUri = 'http://nayhanapl-001-site1.etempurl.com';
    const apiLocal = 'https://localhost:44395';

    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoadingCP, setIsLoadingCP] = useState(false);
    const history = useHistory();

    async function changePassword() {

        const item = localStorage.getItem('user');
        if (item === null) { alert('Debe autenticarse para poder cambiar su contraseña'); return; }
        if (token === '') { alert('Clave anterior incorrecta'); return; }
        let json = JSON.parse(item);
        let [currentUser] = json;
        const encript = sha256(newPassword);
        const oldPassEncript = sha256(token);
        if (currentUser.clave !== oldPassEncript) { alert('El valor introducido en el campo Contraseña actual no coincide con su clave anterior'); return; }
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: currentUser.id,
                clave: encript
            })
        };
        let response = await fetch(`${apiUri}/SaveUpClave`, requestOptions);
        if (response.status !== 200) { alert(`an error has occurred: ${response.statusText}`); return; }
        currentUser.clave = encript;
        //Update password at local storage  
        localStorage.setItem('user', JSON.stringify(currentUser));
        alert('metodo ChangePass/changePassword: Su clave ha sido actualizada con éxito. Debe volver a autenticarse');
        logout();       
    }

    const handleChangePassword = async e => {
        e.preventDefault();
        setIsLoadingCP((prev) => !prev)
        await changePassword();
        setIsLoadingCP((prev) => !prev);
    }
    const logout = () => {
        localStorage.clear();
        history.push('/entrar');
      }
    return (
        <div>
            <h2>Cambiar contraseña</h2>
            <div className='form-group'>
                <label>Contraseña actual</label>
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
            </div>
        </div>
    )
}

export default ChangePassword
