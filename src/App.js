import React from 'react';
import {Switch,Redirect,Route} from 'react-router-dom'
import Login from './container/pages/login/login'
import Home from './container/pages/home/home'
import './app.css'
import 'swiper/css/swiper.css'
function App() {
  return (
      <div className='app'>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/home' component={Home} />
          <Redirect to='/home' />
        </Switch>
      </div>
  );
}
export default App;
