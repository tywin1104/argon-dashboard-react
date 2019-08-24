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
import {Link} from 'react-router-dom'

import Button from '@material-ui/core/Button';
import { Message } from 'semantic-ui-react'

// reactstrap components
import {
  // Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";



class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email : '',
      password : '',
      failedLogin: false
    };
  }
  

  onSubmit = (event) => {
    event.preventDefault();
    fetch('/api/auth/authenticate',  {
      method : 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if ( res.status === 200) {
        this.props.history.push('/');
      } else if(res.status === 401) {
        const error = new Error("wrong Credentials")
        throw error;
      }
    })
    .catch(err => {
      this.setState({failedLogin: true})
    });
  }
  
  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name] : value
    });
  }
 
  

    render() {
      return (
        <>
        <Col lg="5" md="7">
        <Message style={!this.state.failedLogin? {display: 'none'}: {}} negative>
          <Message.Header>Login Failed</Message.Header>
          <p>Please provide correct login credentials</p>
         </Message>
          <Card className="bg-secondary shadow border-0">
            
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                
                <small>Sign in with credentials</small>
                
              </div>
              <Form role="form" onSubmit={this.onSubmit}>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input name="email" 
                    placeholder="Email" 
                    type="email" 
                    value={this.state.email} 
                    onChange={this.handleInputChange}
                    required/>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input name="password" 
                    placeholder="Password" 
                    type="password" 
                    value={this.state.password} 
                    onChange={this.handleInputChange}
                    required/>
                  </InputGroup>
                </FormGroup>
             
                <div className="text-center">
                
                  <Button className="my-4" color="primary" type="submit" >
                    Sign in
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6">
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href=""
                onClick={e => e.preventDefault()}
              >
                <small><Link to="/auth/register">Create new account</Link></small>
              </a>
            </Col>
          </Row>
        </Col>
      </>

      );
    }
  }







 export default Login;

