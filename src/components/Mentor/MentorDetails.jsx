import React from "react";
import {
  Card,
  Container,
  Row,
  CardHeader,
  CardTitle,
  CardBody
} from "reactstrap";

import { Button, Comment, Form} from 'semantic-ui-react'
import Header from "components/Headers/Header.jsx";
import axios from 'axios'

class MentorDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      reply_content: '',
      post: null,
      post_id: ''
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
      username: "testuser"
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
        }else {
          console.log("Unable to get this post by id")
        }
      })
      } else {
        const error = new Error("");
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      alert('Unable to submit reply. Please try again');
    });

  }

  render() {
    if(this.state.post === null){
      return null; //Or some other replacement component or markup
    }
    // console.log("The current post state: ")
    // console.log(this.state.post)
    let replies = this.state.post.replies
    // console.log(replies)
    let comments = replies.map((reply)=> {
    return (
      <Comment>
      <Comment.Avatar as='a' src='/images/avatar/small/joe.jpg' />
      <Comment.Content>
        <Comment.Author>{reply.username}</Comment.Author>
        <Comment.Metadata>
          <div>{reply.timestamp}</div>
        </Comment.Metadata>
        <Comment.Text>
          {reply.content}
        </Comment.Text>
        <Comment.Actions>
          <Comment.Action>
            <div>
              <i className=" ni ni-like-2" />
              <span>Like</span>
            </div>
          </Comment.Action>
        </Comment.Actions>
      </Comment.Content>
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
            <CardHeader tag="h1">{this.state.post.title}</CardHeader>
            <CardBody>
              <CardTitle tag="h3">{this.state.post.content}</CardTitle>
              <Comment.Group size='large'>
                  {comments}
                  <Form reply onSubmit={this.onSubmit}>
                    <Form.TextArea
                      name="reply_content"
                      placeholder="Enter text to reply to this post"
                      value={this.state.reply_content}
                      onChange={this.handleInputChange}
                      required/>
                    <Button content='Add Comment' primary />
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
