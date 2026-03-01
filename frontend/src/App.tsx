import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlayersPage from './pages/PlayersPage';
import SeasonsPage from './pages/SeasonsPage';
import MatchesPage from './pages/MatchesPage';
import PaymentsPage from './pages/PaymentsPage';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/players" component={PlayersPage} />
        <Route path="/seasons" component={SeasonsPage} />
        <Route path="/matches" component={MatchesPage} />
        <Route path="/payments" component={PaymentsPage} />
      </Switch>
    </Router>
  );
};

export default App;