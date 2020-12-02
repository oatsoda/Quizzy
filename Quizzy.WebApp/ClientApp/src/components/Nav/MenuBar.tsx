import React, { useState } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';

export function MenuBar() {

  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);
  
    return (
      <Navbar color="dark" dark expand="md" className="mb-3">
        <NavbarBrand href="/">Quizzy</NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/manage/">Create</NavLink>
            </NavItem>            
          </Nav>
        </Collapse>
      </Navbar>
    );
}