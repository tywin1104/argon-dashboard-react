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
import CircularIntegration from '../../components/CircularIntegration'

// reactstrap components
import {
  Button,
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

class Register extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email : '',
      name : '',
      password : ''
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 200)  {
        alert("Register successful! Please log in to proceed.")
        this.props.history.push('/auth/login');
      } else if(res.status === 500) {
        const error = new Error("Server Error");
        throw error;
      }
    })
    .catch(err => {
      alert('Server Error');
    });
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>Sign Up</small>
              </div>
              <Form role="form" onSubmit={this.onSubmit}>
                { <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input name="name" 
                    placeholder="Username" 
                    value={this.state.name} 
                    onChange={this.handleInputChange}
                    required/>
                  </InputGroup>
                </FormGroup> }
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
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
                <CircularIntegration></CircularIntegration>
                  <Button className="mt-4" color="primary" type="submit">
                    Create account
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

export default Register;
