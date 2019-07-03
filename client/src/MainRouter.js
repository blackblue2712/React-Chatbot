import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Landing from './components/pages/Lading';
import About from './components/pages/About';
import Shop from './components/shop/Shop';
import Header from './components/Header';

const MainRouter = () => (
    <>
        <Header></Header>
        <Switch>
            <Route exact path="/" component={Landing} ></Route>
            <Route exact path="/about" component={About} ></Route>
            <Route exact path="/shop" component={Shop} ></Route>
        </Switch>
    </>
)


export default MainRouter;