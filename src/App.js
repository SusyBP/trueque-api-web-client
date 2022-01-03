import './App.css';
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';


function App() {
  const history = useHistory();
  const [user, setUser] = useState();
  
  useEffect(() => {
    try {
      let item = localStorage.getItem('user');
      if (item !== null) {
        let json = JSON.parse(item);
        let [data] = json;
        setUser(data);
      }
    }
    catch (e) {
        alert(e);
      }    
  }, [])

  const logout = () => {
    localStorage.clear();
    console.log('user after login out');
  }
  return (
    <BrowserRouter>
      <div className='App'>
        <nav className='navbar navbar-expand navbar-light fixed-top'>
          <div className='container'>
            <Link to='/inicio' className='navbar-brand'>Inicio</Link>
            <div className='collapse navbar-collapse'>
              <ul className='navbar-nav ml-auto'>
                {user===undefined&&(<li className='nav-item'>
                  <Link className='nav-link' to='/entrar'>Entrar</Link>
                </li>)}
                {user===undefined&&(<li className='nav-item'>
                  <Link className='nav-link' to='/registrarse'>Registrarse</Link>
                </li>)}
                {user && (<li className='nav-item'>
                  <Link className='nav-link' to='/perfil'>Perfil</Link>
                </li>)}
                {user && (<li className='nav-item'>
                  {/*<Button className='nav-link' onClick={handleClick(history)}>Salir</Button>*/}
                  <DropdownButton id="dropdown-basic-button" title={user.nombre?user.nombre:'usuario'}>
                    <Dropdown.Item onClick={logout} href="/entrar">Salir</Dropdown.Item>
                  </DropdownButton>
                </li>)}
              </ul>
            </div>
          </div>
        </nav>
        <div className='auth-wrapper'>
          <div className='auth-inner'>
            <Switch>
              <Route exact path='/inicio'><h2>Bienvenido a Trueque!</h2></Route>
              <Route exact path='/entrar'>
                <Login setUser={setUser} />
              </Route>
              <Route exact path='/registrarse'>
                <Register />
              </Route>
              <Route exact path='/perfil'>
                <Profile />
              </Route>
              {/* <Route exact path='/perfil'>
                  <Profile/>
                </Route> */}
            </Switch>
          </div>
        </div>
      </div>

    </BrowserRouter>
  );
  // const { token, setToken } = useToken();

  // if(token === null || typeof token === 'undefined') {
  //   return <LoginSimple setToken={setToken}/>
  // }

  // return (
  //   <BrowserRouter>
  //     <div className="container">
  //       <h3 className="m-3 d-flex justify-content-center">
  //         Trueque
  //       </h3>
  //       <Navigation />

  //       <Switch>
  //         <Route path="/" component={Home} exact />
  //         <Route path="/admin/personas" component={Persona} exact />
  //         <Route path="/admin/trueques" component={Trueque} exact />
  //       </Switch>
  //     </div>
  //   </BrowserRouter>
  // );
}


export default App;
