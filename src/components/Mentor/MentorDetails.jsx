import React from "react";
import {
  Card,
  Container,
  Row,
  CardHeader,
  CardTitle,
  CardBody,
  Alert
} from "reactstrap";

import { Button, Comment, Form, Card as CardSemanticUI, Icon, Image, Divider} from 'semantic-ui-react'
import Header from "components/Headers/Header.jsx";
import axios from 'axios'
import moment from 'moment'


class MentorDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      reply_content: '',
      post: null,
      post_id: '',
      reply_users: {}
    };
  }

  componentWillMount() {
    let paths = this.props.location.pathname.split("/")
    let post_id = paths[paths.length-1]
    this.setState({ post_id })

    axios.get(`/api/posts/${post_id}`)
      .then(res => {
        if (res.status === 200) {
          const data = res.data
          this.setState({ post: data.post});
          let replies = this.state.post.replies
          for(let i=0; i<replies.length; i++) {
            let reply = replies[i]
            let username = reply.username
            if(!this.state.reply_users[username]) {
              axios.get(`/api/users/?name=${username}`)
                .then(res => {
                  if(res.status === 200) {
                    let users = res.data.users
                    if(users.length > 0) {
                      const newReplyUsersObj = {
                        ...this.state.reply_users,
                        [username]: users[0]
                      }
                      this.setState({reply_users: newReplyUsersObj})
                    }
                  }
                })
            }
          }
        }else {
          console.log("Unable to get this post by id")
        }
      })
  }


  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    let new_reply = {
      content: this.state.reply_content,
      username: this.props.name
    }
    this.setState({reply_content: ''})
    fetch(`/api/posts/${this.state.post_id}/replies`, {
      method: 'POST',
      body: JSON.stringify({
        replies: [new_reply]
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 200) {
        // TODO: simplify
        axios.get(`/api/posts/${this.state.post_id}`)
        .then(res => {
        if (res.status === 200) {
          const data = res.data
          this.setState({ post: data.post});
        }
        // Increment point for user
        this.changeUserPoints(1)
      })
      } else {
        alert('Unable to submit reply. Please try again');
      }
    })
  }

  changeUserPoints(delta) {
    let user_name = this.props.name
    axios.get(`/api/users/?name=${user_name}`)
      .then(res => {
        if(res.status === 200) {
          let users = res.data.users
          if(users.length > 0) {
            let user_found = users[0]
            let user_id = user_found._id
            let new_points = user_found.points + delta
            axios.patch(`/api/users/${user_id}`, {points: new_points}, {})
              .then(res => {
                if(res.status === 200 ) {
                  console.log(`Successfully increment points of user: ${user_name} by ${delta}`)
                }
              })
          }
        }
      })
  }

  isLoggedIn() {
    return this.props.name !== 'Guest'
  }

  removeOnClick(reply_id) {
    axios.delete(`/api/posts/${this.state.post_id}/replies/${reply_id}`)
      .then(res => {
            //TODO: Simplify after successful delete
            if (res.status === 200) {
              this.changeUserPoints(-1)
              axios.get(`/api/posts/${this.state.post_id}`)
            .then(res => {
            if (res.status === 200) {
              const data = res.data
              this.setState({ post: data.post});
            }else {
              console.log("Unable to get this post by id")
            }
          })
        }else {
          console.log("Unable to delete this reply")
        }
      })
  }

  getUserPointsByName(username) {
    if(this.state.reply_users[username]) {
      return this.state.reply_users[username].points
    }else {
      return ''
    }
  }

  render() {
    const isLoggedIn = this.isLoggedIn()
    if(this.state.post === null){
      return null; //Or some other replacement component or markup
    }
    let replies = this.state.post.replies
    // console.log(replies)
    let comments = replies.map((reply)=> {
      let isSameUser = (reply.username === this.props.name)

        return (
          <Comment className="row">
          <CardSemanticUI className="col-md-3 col-lg-3">
              <Image src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&bold=true&rounded=true&name=${reply.username}`} wrapped ui={false} />
              <CardSemanticUI.Content>
                <CardSemanticUI.Header>{reply.username}</CardSemanticUI.Header>
                <CardSemanticUI.Meta>
                  <span className='date'>{ moment.parseZone(reply.timestamp).local().fromNow()}</span>
                </CardSemanticUI.Meta>
                {/* <CardSemanticUI.Description>
                  Matthew is a musician living in Nashville.
                </CardSemanticUI.Description> */}
              </CardSemanticUI.Content>
              <CardSemanticUI.Content extra>
                <a>
                  <Icon name='user' />
                  {this.getUserPointsByName(reply.username)} Points
                </a>
              </CardSemanticUI.Content>
          </CardSemanticUI>
          <Comment.Content className="col-md-9 col-lg-9" style={{paddingLeft: '5%'}}>
            <Comment.Text style={{fontSize: '130%'}}>
              {reply.content}
            </Comment.Text>
            <Comment.Actions>
              <Comment.Action>
                <span style={(isSameUser || !isLoggedIn) ? {display: 'none'} : {}}>
                  <i className=" ni ni-like-2" />
                  <span style={{paddingRight: '10px'}}><a>Like</a></span>
                </span>
                <span style={(!isSameUser || !isLoggedIn) ? {display: 'none'} : {}}><a onClick={()=>this.removeOnClick(reply._id)}>Remove</a></span>
              </Comment.Action>
            </Comment.Actions>
          </Comment.Content>
          <hr style={{width: '100%', color: 'grey', height: '0.5px', backgroundColor:'grey'}} />
        </Comment>
        )
      })

    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Card body>
            <CardHeader className="text-primary" style={{fontSize: '200%'}}>{this.state.post.title}</CardHeader>
            Created By {this.state.post.username} { moment.parseZone(this.state.post.timestamp).local().fromNow()}
            <CardBody >
              <div>
                <CardTitle style={{fontSize: '130%', marginRight: '25%', lineHeight: '1.5'}} >{this.state.post.content}</CardTitle>
              </div>
              <Comment.Group size='large'>
              <hr style={{width: '100%', color: 'grey', height: '0.5px', backgroundColor:'grey'}} />
                  {comments}
                  <Form reply onSubmit={this.onSubmit}>
                    <Form.TextArea
                      name="reply_content"
                      placeholder="Enter text to reply to this post"
                      value={this.state.reply_content}
                      onChange={this.handleInputChange}
                      required/>
                      <Alert style={isLoggedIn ? {display: 'none'} : {}} color="dark">
                      You have to login in order to submit replies
                      </Alert>
                    <Button disabled={!isLoggedIn} content='Add Comment'  primary />
                  </Form>
                </Comment.Group>
            </CardBody>
            </Card>
          </Row>
        </Container>
      </>
    );
  }
}

export default MentorDetails;
