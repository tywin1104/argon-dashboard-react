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

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Table,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form, FormGroup, Label, Input
} from "reactstrap";
// core components
import Header from "components/Headers/Header.jsx";
import axios from 'axios'
import {Link} from 'react-router-dom'


class Tables extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      modal: false,
      new_post_title: '',
      new_post_content: ''
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    axios.post(`/api/posts/`, {
      username: this.props.name,
      title: this.state.new_post_title,
      content: this.state.new_post_content
    })
    .then(res => {
      if (res.status === 200) {
        console.log("added new post")
      } else {
        alert("Unable to add a new post. Please try again")
      }
    })
    this.toggle()
    // TODO: Simplify
    axios.get(`/api/posts/`)
      .then(res => {
        if (res.status === 200) {
          const data = res.data
          console.log('Got all posts:')
          console.log(data)
          this.setState({ posts: data.posts});
        }else {
          console.log("Unable to get all posts")
        }
      })
  }

  removeOnClick(post_id) {
    axios.delete(`/api/posts/${post_id}`)
      .then(res => {
            //TODO: Simplify after successful delete
            if (res.status === 200) {
              axios.get(`/api/posts/`)
                .then(res => {
                if (res.status === 200) {
                  const data = res.data
                  this.setState({ posts: data.posts});
                }else {
                  console.log("Unable to get posts")
                }
              })
        }else {
          console.log("Unable to delete this post")
        }
      })
  }


  componentWillMount() {
    axios.get(`/api/posts/`)
      .then(res => {
        if (res.status === 200) {
          const data = res.data
          console.log('Got all posts:')
          console.log(data)
          this.setState({ posts: data.posts});
        }else {
          console.log("Unable to get all posts")
        }
      })
  }
  render() {
    let posts = this.state.posts
    const isLoggedIn = this.props.name !== 'Guest'
    let table_rows = posts.map((post)=> {
      let isSameUser = (post.username === this.props.name) && this.props.name !== 'Guest'
      return (
          <tr>
          <th scope="row">
            <Media className="align-items-center">
              <i className=" ni ni-align-left-2" />
              <Media>
                <span className="mb-0 text-sm">
                  <Link
                  to={{ pathname: '/admin/mentor/'+post._id}}
                  key={post._id}>
                    {post.title}
                 </Link>
                </span>
              </Media>
            </Media>
          </th>
          <td>{post.replies.length}</td>
          <td>
            <Badge color="" className="badge-dot mr-4">
              <i className="bg-warning" />
              Pending
            </Badge>
            {/* <Badge color="" className="badge-dot">
              <i className="bg-success" />
                Resolved
            </Badge> */}
          </td>
          <td>
            {post.username}
          </td>
          <td className="text-right">
            <UncontrolledDropdown>
              <DropdownToggle style={!isSameUser ? {display: 'none'} : {}}
                className="btn-icon-only text-light"
                href="#pablo"
                role="button"
                size="sm"
                color=""
                onClick={e => e.preventDefault()}
              >
                <i className="fas fa-ellipsis-v" />
              </DropdownToggle>
              <DropdownMenu  style={!isSameUser ? {display: 'none'} : {}} className="dropdown-menu-arrow" right>
                <DropdownItem >
                  <a  className="text-danger" onClick={()=>this.removeOnClick(post._id)}>Remove</a>
                </DropdownItem>
                <DropdownItem>
                  <a  className="text-info">Mark as resolved</a>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>
      )
    })
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                    <h3 className="mb-0">Posts</h3>
                    <div>
                      <Button disabled={!isLoggedIn} color="primary" onClick={this.toggle}>Add new post</Button>
                      <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>Submit a new post</ModalHeader>
                        <ModalBody>
                          <Form role="form" onSubmit={this.onSubmit}>
                            <FormGroup>
                              <Label for="exampleEmail">Title</Label>
                              <Input  name="new_post_title"  value={this.state.new_post_title} onChange={this.handleInputChange} required placeholder="Please summarize your question here" />
                            </FormGroup>
                            <FormGroup>
                              <Label for="exampleText">Content</Label>
                              <Input type="textarea" name="new_post_content" value={this.state.new_post_content} onChange={this.handleInputChange} required placeholder="Please describe your question in detail"/>
                            </FormGroup>
                            <ModalFooter>
                              <Button color="primary" type="submit">Post</Button>{' '}
                              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                            </ModalFooter>
                          </Form>
                        </ModalBody>
                      </Modal>
                    </div>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Title</th>
                      <th scope="col">Replies</th>
                      <th scope="col">Status</th>
                      <th scope="col">User</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {table_rows}
                  </tbody>
                </Table>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Tables;
