


import React from "react";
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  Container,
  Row

} from "reactstrap";
// core components
import Header from "components/Headers/Header.jsx";
import axios from "axios";

import { Button, List} from 'semantic-ui-react'

import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Link} from 'react-router-dom';

class Clubs extends React.Component {
  constructor() {
    super();
    this.state = {
        groups: [],
        current_user: {},
        joinedGroups: []
    }
  }
    

  componentWillMount() {
    axios.get('/api/groups/')
    .then(res => {
      if (res.status === 200) {
        const data = res.data
        console.log('Got all groups')
        console.log(data)
        this.setState({groups: data.groups});
      }else{
        console.log("Unable to get all groups")
      }
      axios.get(`/api/users?name=${this.props.name}`)
        .then(res => {
          if (res.status === 200) {
            const user = res.data.users[0]
            this.setState({current_user: user});
          }else{
            console.log("Unable to get all posts")
          }
        })
        this.getJoinedGroups();
    })
  }

  onJoin(group_id) {
      axios.post(`/api/groups/${group_id}/members/`, {
          username: this.props.name
      })
      .then(res => {
        if (res.status === 200) {
           axios.post(`/api/users/${this.state.current_user._id}/groups`, {
               group: {
                groupID: group_id,
                memberType: "MEMBER"
            }
           })
           .then(res => {
               if(res.status === 200) {
                   console.log("successfully update user's group metadata")
               }
               // Hard refresh
               axios.get('/api/groups/')
               .then(res => {
                 if (res.status === 200) {
                   const data = res.data
                   console.log('Got all groups')
                   console.log(data)
                   this.setState({groups: data.groups});
                 }else{
                   console.log("Unable to get all groups")
                 }
                 axios.get(`/api/users?name=${this.props.name}`)
                   .then(res => {
                     if (res.status === 200) {
                       const user = res.data.users[0]
                       this.setState({current_user: user});
                     }else{
                       console.log("Unable to get all posts")
                     }
                   })
                   this.getJoinedGroups();
                   //End of Hard Refresh
               })
           })
          }else{
            console.log("Unable to add member to the group")
          }
      }
        )
  }

  getJoinedGroups() {
      let joinedGroups = this.state.groups.filter((group) => {
          return group.members.includes(this.props.name)
      })
      return this.setState({joinedGroups})
  }
  render() {

    let groups = this.state.groups
    // console.log(groups)
    let group_rows = groups.map((group) => {
  
        return (
            <List.Item>
                <List.Content  floated='right'>
                    <Button disabled={this.props.name === 'Guest' || group.members.includes(this.props.name)}  onClick={()=>this.onJoin(group._id)}>Join</Button>
                </List.Content>
                <List.Content  style={{paddingRight: '2%'}} floated='right'>
                    <Badge style={{height: '3vh', fontSize: '105%' }} color="primary">Current Members: {group.members.length}</Badge>
                </List.Content>
                <List.Content className="h2"> <FontAwesomeIcon icon={faUsers}/> {group.title}</List.Content>
                
            </List.Item>
            
            
        )
      })
      
      let group_tags = this.state.joinedGroups.map((group) => {
          return (
            <Link
            to={{ pathname: '/admin/clubs/'+group._id}}
            key={group._id}> 
            <Chip 
                style={{marginTop: '4%', marginRight: '3%'}}
                icon={<FaceIcon />}
                label={group.title}
                clickable
                color="primary"
                />
            </Link>
                
          )
      }) 

    return (
      <>
        <Header />
        {/* Page content */}
        
        <Container  className="mt--7" fluid>
          {/* Table */}
         
          <Row >
            <div className="col">
              <Card   className="shadow">
                <CardHeader  style={{backgroundRepeat: 'repeat', backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_lOqd08RhMtPu8rMCVlKN_tZ3af715OaSMj0MsfyMQ15hz_1HFg")'}} className="border-0">
                  <Row>
                  <h3 className="mb-0">Clubs</h3>
                  </Row>  
                </CardHeader>
                <List divided verticalAlign='middle'>
                    {group_rows}
                </List> 
                 </Card>
             </div>
            </Row>
            {group_tags}
    
</Container>

      </>
    );
  }
}



export default Clubs;
