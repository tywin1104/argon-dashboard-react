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
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
// reactstrap components

import axios from "axios";

import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactWeather from 'react-open-weather'
import 'react-open-weather/lib/css/ReactWeather.css';
import '../assets/css/indexPage.css'

import {
  Button,
  Card,
  CardHeader,
  Progress,
  Table,
  Container,
  Row,
  Alert,
  Form,
  Input,
  Col,
  Label,
  FormGroup
} from "reactstrap";

import { Message, Image } from 'semantic-ui-react'
// core components
import {
  chartOptions,
  parseOptions,
} from "variables/charts.jsx";

import Header from "components/Headers/Header.jsx";
const announcmentStyle = {
  fontSize: '150%'  
};

class Index extends React.Component {

  componentWillMount() {
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
    axios.get(`/api/announcements/recent`)
    .then(res => {
      if (res.status === 200) {
        const data = res.data
        this.setState({announcement: data.announcement});
      }else{
        console.log("Unable to get this announcement by id")
      }
      axios.get(`/api/users?name=${this.props.name}`)
      .then(res => {
        if (res.status === 200) {
          const user = res.data.users[0]
          this.setState({current_user: user});
          axios.get('/api/users/')
            .then(res => {
              if(res.status === 200) {
                const data = res.data
                this.setState({all_users: data.users})
                console.log("Sorted USer:")
                console.log(this.getUsersSortedByPoints())
              }
            })
        }else{
          console.log("Unable to get all posts")
        }
      })
    })
  }


  constructor(props) {
    super(props)
    this.state = {
      announcement : {},
      new_announcement : "",
      current_user: {},
      all_users:  [{}]
    };
  }


  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name] : value
    });
  }

  getUsersSortedByPoints() {
    return this.state.all_users.sort((user1, user2) => {
      return (user1.points <= user2.points) ? 1 : -1
    })
  }

  onSubmit = (event) => {
    event.preventDefault();
    axios.post('/api/announcements/',  {
      content: this.state.new_announcement
    })
    .then(res => {
      if ( res.status === 200) {
        axios.get(`/api/announcements/recent`)
          .then(res => {
            if (res.status === 200) {
              const data = res.data
              this.setState({announcement: data.announcement});
            }else{
              console.log("Unable to get this announcement by id")
            }
          })
      }
    })
  }

  getTrophyStyle(index) {
    if(index > 2) {
      return {
        display: 'none'
      }
    }
    let style = {
      paddingRight: '5%',
      fontSize: '200%',
      color: ''
    }
    if(index === 0) {
      style.color = 'rgb(248,206,56)'
    }else if(index === 1) {
      style.color = 'rgb(192,192,192)'
    }else if(index === 2) {
      style.color = '#cd7f32'
    }
    return style;
  }
 
  render() {
    let top_users = this.getUsersSortedByPoints().slice(0,5).map((user, index)=> {
      return (
        <tr>
          <th scope="row"><span style={this.getTrophyStyle(index)} ><FontAwesomeIcon icon={faTrophy}/></span>{user.name}</th>
          <td>{user.points}</td>
          <td>
            <div className="d-flex align-items-center">
              <div>
                <Progress
                  max="100"
                  value={100- index*20}
                  barClassName="bg-gradient-danger"
                />
              </div>
            </div>
          </td>
        </tr>
      )
    })
    return (
      
      <>
         <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>

      <Message style={{margin: '0'}} size="large" color='orange'>
        <Message.Header>{this.state.announcement.content}</Message.Header>
        <p>Today is Day 5.</p>
      </Message>
      
      <Form style={(!this.state.current_user || !this.state.current_user.userType || this.state.current_user.userType !== 'ADMIN') ?  {display: 'none'}: {}}  onSubmit={this.onSubmit} >
        <FormGroup >
          <Label for="new_announcement">Edit an Description</Label>
          <Input 
            name="new_announcement" 
            placeholder="sample announcement"
            value={this.state.new_announcement}
            onChange={this.handleInputChange}
          ></Input>
          <Button type="submit">Submit</Button>
        </FormGroup>
      </Form>
          <Row>
          
          </Row>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="shadow">
                  <ReactWeather
                      forecast="today"  
                      apikey="59feb43bb94f4544be200049192108"
                      type="city"
                      city="Toronto"
                    />
                    {/* <p style={{position: "absolute", bottom: "10%"}}>Today is day 2</p> */}
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Leaderboard</h3>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">User Name</th>
                      <th scope="col">Points</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                      {top_users}
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
          {/* <img style={{width:'100%'}} src="https://cdn1.imggmi.com/uploads/2019/8/24/6e6281565b3a24591bcc81461a0361e6-full.jpg"></img> */}
          <Image style={{marginTop:"-22%", zIndex:'-1'}} bordered src='https://cdn1.imggmi.com/uploads/2019/8/24/7179d0ee805bd6c1c7df2e1fe3daed02-full.jpg' fluid />
        </Container>
      </>
    );
  }
}

export default Index;
