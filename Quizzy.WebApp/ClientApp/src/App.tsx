import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { PlayQuiz } from './components/PlayQuiz';
import { QuizResults } from './components/QuizResults';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route exact path='/quiz/:code' component={PlayQuiz} />
        <Route path='/quiz/:code/results/:participantId' component={QuizResults} />
      </Layout>
    );
  }
}
