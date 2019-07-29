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
// react component that copies the given text inside your clipboard
// reactstrap components
import {
  Card,
  Container,
  Row,
  CardHeader,
  CardTitle,
  CardBody
} from "reactstrap";

import { Button, Comment, Form, Message } from 'semantic-ui-react'
// core components
import Header from "components/Headers/Header.jsx";
import axios from 'axios'

class MentorDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      post: {}
    };
  }

  componentWillMount() {
    let paths = this.props.location.pathname.split("/")
    let post_id = paths[paths.length-1]
    console.log(post_id)
    axios.get(`/api/posts/${post_id}`)
      .then(res => {
        if (res.status === 200) {
          const data = res.data
          console.log('Got this post: ')
          console.log(data)
          this.setState({ post: data});
        }else {
          console.log("Unable to get this post by id")
        }
      })
  }

  render() {
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
              <Comment.Group>
                  <Comment>
                    <Comment.Avatar as='a' src='/images/avatar/small/joe.jpg' />
                    <Comment.Content>
                      <Comment.Author>Joe Henderson</Comment.Author>
                      <Comment.Metadata>
                        <div>1 day ago</div>
                      </Comment.Metadata>
                      <Comment.Text>
                        <p>
                          The hours, minutes and seconds stand as visible reminders that your effort put them all
                          there.
                        </p>
                        <p>
                          Preserve until your next run, when the watch lets you see how Impermanent your efforts
                          are.
                        </p>
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

                  <Comment>
                    <Comment.Avatar as='a' src='/images/avatar/small/christian.jpg' />
                    <Comment.Content>
                      <Comment.Author>Christian Rocha</Comment.Author>
                      <Comment.Metadata>
                        <div>2 days ago</div>
                      </Comment.Metadata>
                      <Comment.Text>I re-tweeted this.</Comment.Text>
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

                  <Form reply>
                    <Form.TextArea />
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
