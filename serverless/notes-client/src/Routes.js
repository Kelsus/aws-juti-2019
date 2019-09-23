import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import NewNote from './containers/NewNote';
import Notes from './containers/Notes';

const Routes = () => 
    <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/notes/new" exact component={NewNote} />
        <Route path="/notes/:id" exact component={Notes} />
        <Route component={NotFound} />
    </Switch>;

export default Routes;