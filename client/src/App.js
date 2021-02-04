// Dependencies
import React, {Fragment, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar.js';
import Landing from './components/layout/Landing.js';

import Login from './components/auth/Login.js';
import Register from './components/auth/Register.js';
import Alert from './components/layout/Alert.js';

import Dashboard from './components/dashboard/Dashboard.js';

import CreateProfile from './components/profile-forms/CreateProfile.js';
import EditProfile from './components/profile-forms/EditProfile.js';
import AddExperience from './components/profile-forms/AddExperience.js';
import AddEducation from './components/profile-forms/AddEducation.js';

import Profiles from './components/profiles/Profiles.js';
import Profile from './components/profile/Profile.js';

import PrivateRoute from './components/routing/PrivateRoute.js';

// Redux
import {Provider} from 'react-redux';
import store from './store';
import {loadUser} from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';


if(localStorage.token) {
  setAuthToken(localStorage.token);
}

const  App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, [])

  return(
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing}/>
            <section className='container'>
              <Alert />
              <Switch>
                <Route exact path='/register' component={Register}/>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/profiles' component={Profiles}/>
                <Route exact path='/profile/:id' component={Profile}/>
                <PrivateRoute exact path='/dashboard' component={Dashboard}/>
                <PrivateRoute exact path='/create-profile' component={CreateProfile}/>
                <PrivateRoute exact path='/edit-profile' component={EditProfile}/>
                <PrivateRoute exact path='/add-experience' component={AddExperience}/>
                <PrivateRoute exact path='/add-education' component={AddEducation}/>
              </Switch>
            </section>
        </Fragment>
      </Router>
    </Provider>
  )
};


export default App;
