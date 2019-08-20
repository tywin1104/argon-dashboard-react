/*!


=========================================================
* Mentr Website - v1.0.0
=========================================================

* Copyright 2019 Mentr Team 

* Coded by Mentr Team

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
    super()
    this.state = {
      email : '',
      name : 'Guest'
    };
  }

getLoggedInRoutes = () => {
  let newRoutes = routes.filter(function (el) {
    return el.name !== 'Login' &&
           el.name !== 'Register'  &&
           el.name !== 'MentorDetails' &&
           el.name !== 'ClubDetails'
  });
return newRoutes
}

  getProperRoutes = () => {
    if(this.state.name !== 'Guest') {
      return this.getLoggedInRoutes()

    }else{
      return routes.filter(function(el) {
        return el.name !== 'MentorDetails' &&
               el.name !== 'ClubDetails'
      })
    }
  }



  componentWillMount() {
    let token = Cookies.get('token')
    if (token === undefined) {
      console.log("No JWT token found!")
      return
    }else {
      console.log(token)

      axios.get(`http://localhost:8080/api/auth/checkToken?token=${token}`)
      .then(res => {
        if(res.status === 200){
          const data = res.data
          console.log(data)
          this.setState({ email: data.email, name: data.name });
        }else {
          console.log(res.error)
          const error = new Error(res.error);
          throw error;
        }
      }).catch(err => {
        this.setState({email: "Guest"});

      })
    }
  }


  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={(props) => <prop.component email={this.state.email} name={this.state.name} {...props} />}
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
            imgSrc: require("assets/img/brand/logo.png"),
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
