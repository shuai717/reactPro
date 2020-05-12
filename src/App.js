import React from 'react';
import {Switch,Redirect,Route} from 'react-router-dom'
import Index from './container/pages/index/index'
import Buy from './container/pages/buy/buy'
import Category from './container/pages/category/category'
import Personal from './container/pages/personal/personal'
import ShopCar from './container/pages/shopCar/shopCar'

function App() {
  return (
      <div className='app'>
        <Switch>
          <Route path='/index' component={Index} />
          <Route path='/buy' component={Buy} />
          <Route path='/category' component={Category} />
          <Route path='/personal' component={Personal} />
          <Route path='/shopCar' component={ShopCar} />
          <Redirect to='/index' />
        </Switch>
       
      </div>
  );
}
export default App;
