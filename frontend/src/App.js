import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProjectList from './ProjectList';
import ProjectEdit from "./ProjectEdit";
import TaskList from "./TaskList";
import TaskEdit from "./TaskEdit";
import {CookiesProvider} from "react-cookie";

class App extends Component {
  render() {
    return (
        <CookiesProvider>
          <Router>
            <Switch>
              <Route path='/' exact={true} component={Home}/>
              <Route path='/projects' exact={true} component={ProjectList}/>
              <Route exact path='/projects/:projectId' component={ProjectEdit}/>
              <Route exact path='/projects/:projectId/:projectName' component={TaskList}/>
              <Route exact path='/projects/:projectId/:projectName/:taskId' component={TaskEdit}/>
            </Switch>
          </Router>
        </CookiesProvider>
    )
  }
}

export default App;
