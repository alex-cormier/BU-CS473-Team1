import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TutorialList from './TutorialList';
import TutorialEdit from "./TutorialEdit";
import CommentList from "./CommentList";
import CommentEdit from "./CommentEdit";
import {CookiesProvider} from "react-cookie";

class App extends Component {
  render() {
    return (
        <CookiesProvider>
            <Router>
              <Switch>
                <Route path='/' exact={true} component={Home}/>
                <Route path='/tutorials' exact={true} component={TutorialList}/>
                <Route exact path='/tutorials/:tutorialId' component={TutorialEdit}/>
                <Route exact path='/tutorials/:tutorialId/:tutorialTitle' component={CommentList}/>
                <Route exact path='/tutorials/:tutorialId/:tutorialTitle/:commentId' component={CommentEdit}/>
              </Switch>
            </Router>
        </CookiesProvider>
    )
  }
}

export default App;
