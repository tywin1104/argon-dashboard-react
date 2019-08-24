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
               el.name !== 'ClubDetails' &&
               el.name !== 'User Profile'
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
            render={(props) => <prop.component  {...props} email={this.state.email} name={this.state.name} />}
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
            imgSrc: "data:image/png;base64,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",
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
