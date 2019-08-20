


import React from "react";
import { Tab, Image, List, FormGroup} from 'semantic-ui-react'

// reactstrap components
import {
  Card,
  Container,
  Alert,
  Jumbotron,
  Input,
  Label,
  Form,
  Button
} from "reactstrap";
import Header from "components/Headers/Header.jsx";
import axios from "axios";


class Tables extends React.Component {
  constructor() {
    super();
    this.state = {
        new_description: "",
        new_announcement: "",
        group: {
            description: "",
            members:[], 
            _id: "",
            title: "",
            announcements:[{}]
        },
        current_user: {
            groups: [{groupID: "", memberType: "", _id: ""}]
        },
    }
  }

  componentWillMount() {
    let paths = this.props.location.pathname.split("/")
    let group_id = paths[paths.length-1]
    axios.get(`/api/groups/${group_id}`)
    .then(res => {
      if (res.status === 200) {
        const data = res.data
        this.setState({group: data.group});
        // console.log(this.state.group)
        // console.log(this.state.group.announcements)
      }else{
        console.log("Unable to get this group")
      }
      axios.get(`/api/users?name=${this.props.name}`)
        .then(res => {
          if (res.status === 200) {
            const user = res.data.users[0]
            this.setState({current_user: user});
          }else{
            console.log("Unable to get current user")
          }
        })
    })
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name] : value
    });
  }

  onNewAnnouncement = (event) => {
    event.preventDefault();
    let paths = this.props.location.pathname.split("/")
    let group_id = paths[paths.length-1]
    event.preventDefault();
    axios.post(`/api/groups/${group_id}/announcements`,  { 
      announcement: {content: this.state.new_announcement}
    })
    .then(res => {
      if (res.status === 200) {
        console.log("successfully added new announcement")
        // HARD REFRESH
        axios.get(`/api/groups/${group_id}`)
        .then(res => {
          if (res.status === 200) {
            const data = res.data
            this.setState({group: data.group});
          }else{
            console.log("Unable to get this group")
          }
        })
        // HARD REFRESH
        this.setState({new_announcement : ""})
        
      }else {
        console.log("Unable to add new announcement")
      }
    })
  }
  
  onNewDescription = (event) => {
    event.preventDefault();
    let paths = this.props.location.pathname.split("/")
    let group_id = paths[paths.length-1]
    event.preventDefault();
    axios.patch(`/api/groups/${group_id}/`,  { 
      description: this.state.new_description
    })
    .then(res => {
      if (res.status === 200) {
        console.log("successfully added new description")
        // HARD REFRESH
        axios.get(`/api/groups/${group_id}`)
        .then(res => {
          if (res.status === 200) {
            const data = res.data
            this.setState({group: data.group});
          }else{
            console.log("Unable to get this group")
          }
        })
        // HARD REFRESH
        this.setState({new_description : ""})
        
      }else {
        console.log("Unable to add new description")
      }
    })
  }
  

  checkGroupAdmin() {
    let paths = this.props.location.pathname.split("/")
    let group_id = paths[paths.length-1]
    let groups = this.state.current_user.groups
    for(let i=0; i<groups.length; i++) {
      let group = groups[i];
      if(group.groupID === group_id) {
        return group.memberType === "GROUPHEAD"
      }
    }
    return false;
  }
  
    
  render() {

    let members = this.state.group.members.map((member)=> {
        return (
           
            <List.Item>
              <Image avatar src='https://react.semantic-ui.com/images/avatar/small/christian.jpg' />
              <List.Content>
                <List.Header>{member}</List.Header>
              </List.Content>
            </List.Item>
          
        )
    })

    let announcement = null;
    if(this.state.group.announcements.length > 0) {
        announcement = (
            <Alert style={{fontSize: "150%"}} color="primary">
                 {this.state.group.announcements[this.state.group.announcements.length-1].content}
             </Alert>
        )
    }
    const panes = [
        { menuItem: 'Announcements', render: () => (
            <Tab.Pane>
                {announcement}
                <Form style={(!this.checkGroupAdmin()) ? {display: 'none'} : {}} onSubmit={this.onNewAnnouncement} >
                  <FormGroup >
                    <Label for="new_announcement">Post an announcement</Label>
                    <Input 
                      name="new_announcement" 
                      placeholder="sample announcement"
                      value={this.state.new_announcement}
                      onChange={this.handleInputChange}
                    ></Input>
                    <Button type="submit">Submit</Button>
                  </FormGroup>
                </Form>
                
            </Tab.Pane>
        )},
        { menuItem: 'Members', render: () => <Tab.Pane>
             <List animated verticalAlign='middle'>
                 {members}
             </List>
             
        </Tab.Pane> }
      ]


    return (
      <>
        <Header />
        {/* Page content */}
        
        <Container className="mt--7" fluid>
          {/* Table */}
         
          {/* <Row> */}
            <div className="col">
              <Card className="shadow">
             <div>
                <h2 style={{marginBottom: "2%",marginTop: "1%",marginLeft: "1%"}}>{this.state.group.title}</h2>
            </div> 
                <Tab panes={panes} />
                </Card>
                 <Jumbotron>
                <p className="lead">{this.state.group.description}</p>
                <Form style={(!this.checkGroupAdmin()) ? {display: 'none'} : {}} onSubmit={this.onNewDescription} >
                  <FormGroup >
                    <Label for="new_description">Edit an Description</Label>
                    <Input 
                      name="new_description" 
                      placeholder="sample description"
                      value={this.state.new_description}
                      onChange={this.handleInputChange}
                    ></Input>
                    <Button type="submit">Submit</Button>
                  </FormGroup>
                </Form>
                </Jumbotron>
             </div>

             
            
            {/* </Row> */}
        
    
    </Container>

      </>
    );
  }
}



export default Tables;
