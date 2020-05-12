import React, { Component } from 'react'
import {Switch,Redirect,Route} from 'react-router-dom'
import Index from '../index/index'
import Buy from '../buy/buy'
import Category from '../category/category'
import Personal from '../personal/personal'
import ShopCar from '../shopCar/shopCar'
export default class Home extends Component {
    render() {
        return (
            
            <div>
                <Switch>
                    <Route path='/home/index' component={Index} />
                    <Route path='/home/buy' component={Buy} />
                    <Route path='/home/category' component={Category} />
                    <Route path='/home/personal' component={Personal} />
                    <Route path='/home/shopCar' component={ShopCar} />
                    <Redirect to='/home/index' />
                </Switch>
            </div>
        )
    }
}
