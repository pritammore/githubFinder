import React, {useState, Fragment} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Components/layout/Navbar';
import Alert from './Components/layout/Alert';
import Users from './Components/users/Users';
import User from './Components/users/User';
import Search from './Components/users/Search';
import About from './Components/pages/About';
import PropTypes from 'prop-types';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [repos, setRepos] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const showAlert = (msg, type) => {
    setAlert({ msg, type });

    setTimeout(() => {
      setAlert(null);
    }, 5000);
  }

  const searchUsers = async (text) => {
      setLoading(true);
      const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_ID}&client_secret=${process.env.REACT_APP_GITHUB_SECRET}`);      
      setUsers(res.data.items);
      setLoading(false);
    };

  // Get user detail from Github
  const getUser = async (username) => {
    setLoading(true);
    const res = await axios.get(`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_ID}&client_secret=${process.env.REACT_APP_GITHUB_SECRET}`);      
    setUser(res.data);
    setLoading(false);
  }

  // Get user repos from Github
  const getUserRepos = async (username) => {
    setLoading(true);
    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_ID}&client_secret=${process.env.REACT_APP_GITHUB_SECRET}`);
    setRepos(res.data);
    setLoading(false);
  }
  
  const clearUsers = () => {
    setUsers([]);
    setLoading(false);
  };

    return (
      <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Alert alert={alert} />
          <Switch>
            <Route exact path='/' render={props => (
              <Fragment>
                <Search
                    searchUsers={searchUsers}
                    clearUsers={clearUsers}
                    showClear={users.length > 0 ? true: false}
                    setAlert={showAlert} />
                <Users loading={loading} users={users} />
              </Fragment>
            )} />
            <Route exact path='/about' component={About} />
            <Route path='/user/:login' render={props => (
              <User 
                {...props} 
                getUser={getUser}
                getUserRepos={getUserRepos}
                user={user}
                repos={repos}
                loading={loading} />
            )} />
          </Switch>
        </div>
      </div>
      </Router>
    );
}

App.propsTypes = {
  searchUsers: PropTypes.func.isRequired,
  clearUsers: PropTypes.func.isRequired,
  showClear: PropTypes.bool.isRequired,
  showAlert: PropTypes.func.isRequired
};

export default App;
