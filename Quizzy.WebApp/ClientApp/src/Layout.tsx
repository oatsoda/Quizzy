import React, { Component } from 'react';
import { Container } from 'reactstrap';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-fill">
          <Container fluid={true} className="p-0">
            {this.props.children}
          </Container>
        </main>
        <footer>
          <Container className="text-center">
            <p className="text-muted">Credits | About</p>
          </Container>
        </footer>
      </div>
    );
  }
}
