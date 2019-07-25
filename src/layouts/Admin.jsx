/*!

=========================================================
* Argon Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { Route, Switch } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.jsx";
import AdminFooter from "components/Footers/AdminFooter.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";

import routes from "routes.js";
import Cookies from 'js-cookie';
import axios from 'axios'

class Admin extends React.Component {
  constructor() {
    super();
    this.state = {
      email : '',
      name: 'Guest'
    };
  }

  componentWillMount() {
    let token = Cookies.get('token')
    if (token === undefined) {
      console.log("No JWT token found")
      return
    }else {
      console.log(token)

      axios.get(`/api/auth/checkToken?token=${token}`)
        .then(res => {
          if (res.status === 200) {
            const data = res.data
            console.log(data)
            this.setState({ email: data.email, name: data.name});
          }else {
            console.log(res.error)
            const error = new Error(res.error);
            throw error;
          }
        }).catch(err => {
            console.log(err)
        })
    }
  }

  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }

  getLoggedInRoutes = () => {
    let newRoutes = routes.filter(function (el) {
      return el.name !== 'Login' &&
             el.name !== 'Register'
    });
    return newRoutes
  }


  // Get proper contents on sidebar based on whether logged in
  getProperRoutes = () => {
    if(this.state.name !== 'Guest') {
      return this.getLoggedInRoutes()
    }else {
      return routes
    }
  }

  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  render() {
    return (
      <>
        <Sidebar
          {...this.props}
          routes={this.getProperRoutes()}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("assets/img/brand/argon-react.png"),
            imgAlt: "..."
          }}
        />
        <div className="main-content" ref="mainContent">
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
            email={this.state.email}
            name={this.state.name}
          />
          <Switch>{this.getRoutes(routes)}</Switch>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    );
  }
}

export default Admin;
