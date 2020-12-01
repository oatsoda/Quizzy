import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './Layout';
import { PageHome } from './components/Pages/Home/PageHome';
import { PagePlay } from './components/Pages/Play/PagePlay';
import { PageResults } from './components/Pages/Results/PageResults';
import { PageManage } from './components/Pages/Manage/PageManage';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={PageHome} />
        <Route exact path='/quiz/:code' component={PagePlay} />
        <Route path='/quiz/:code/results/:participantId' component={PageResults} />
        <Route path='/manage' component={PageManage} />
      </Layout>
    );
  }
}
