


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
  Form, 
  FormGroup, 
  Label, 
  Input

} from "reactstrap";
// core components
import Header from "components/Headers/Header.jsx";
import axios from "axios";
import {Link} from 'react-router-dom';
import moment from 'moment';

class Tables extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      modal: false,
      new_post_title: '',
      new_post_content: '',
      current_user: {},
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    axios.get('/api/posts/')
    .then(res => {
      if (res.status === 200) {
        const data = res.data
        console.log('Got all posts')
        console.log(data)
        this.setState({posts: data.posts});
      }else{
        console.log("Unable to get all posts")
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
    })
  }
  


  isLoggedIn() {
    return this.props.name !== 'Guest'
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
    this.changeUserPoints(2)
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

  onDelete(post_id) {
    axios.delete(`/api/posts/${post_id}`)
    .then(res => {
      if (res.status === 200) {
        this.changeUserPoints(-2)
        axios.get(`/api/posts`)
        .then(res => {
          if (res.status === 200) {
        const data = res.data
        this.setState({posts: data.posts});
      }else{
        console.log("doesnt matter")
      }
    })
  }else{
    console.log("Unable to Delete this post")
  }
})
}
onChangeStatus(post_id) {
  axios.patch(`/api/posts/${post_id}`,{
    resolved: true
  } )
  .then(res => {
    if (res.status === 200) {
     // this.changeUserPoints(-1)
      axios.get(`/api/posts`)
      .then(res => {
        if (res.status === 200) {
      const data = res.data
      this.setState({posts: data.posts});
    }else{
      console.log("doesnt matter")
    }
  })
}else{
  console.log("Unable to Delete this post")
}
})
}
changeUserPoints(delta) {
  let user_name = this.props.name
  axios.get(`/api/users?name=${user_name}`)
  .then(res => {
    if(res.status === 200) {
      let users = res.data.users
    if(users.length > 0) {
      let user_found = users[0]
      let user_id = user_found._id
      let new_points = user_found.points + delta
      axios.patch(`/api/users/${user_id}`, {points: new_points}, {})
      .then(res => {
        if(res.status === 200) {
          console.log(`Succesfully incremenet points of user: ${user_name} by ${delta}`)
    }
  })
}
}
})
}
    

  render() {
    let posts = this.state.posts
    let table_rows = posts.map((post) => {
      let isSameUser = post.username === this.props.name
      let isResolved = post.resolved 
      let adminTrue = this.props.name === 'Admin'
      
      // let display;
      // if (adminTrue) {
      //   display = (
      //     <div>style={   {display: 'block'} } </div>
      //   )
      // }else{
      //   display = (

      //   <div>style={(!isSameUser || !this.isLoggedIn()) ? {display: 'none'}: {}  } </div>
      //   )
      // }
      console.log(adminTrue)
      let bar;
      if (!isResolved) {
        bar =  (
          <Badge color="" className="badge-dot mr-4">
            <i className="bg-warning" />
            In Progress
          </Badge>
        )
      }else{
        bar = (
          <Badge color="" className="badge-dot mr-4">
            <i className="bg-success" />
            Resolved
          </Badge>
        )
      }


      return (
       
        <tr>
                      <th scope="row">
                        <Media className="align-items-center">
                          <i className="ni ni-align-left-2"> </i>
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
                        {bar}
                      </td>
                      <td>
                        {post.username}
                      </td>
                      <td>
                      {moment.parseZone (post.timestamp).local().fromNow()}
                      </td>
                      <td className="text-right">
                      <div 
                      style={  ((!isSameUser || !this.isLoggedIn()) && (!this.state.current_user || !this.state.current_user.userType || this.state.current_user.userType !== 'ADMIN')) ? {display: 'none'}: {}  }
                      //  style={  (!this.isLoggedIn()) ? {display: 'none'}: {}  }
                      // style={  (!isSameUser) ? {display: 'none'}: {}  }

                      // style={(adminTrue  ||  isSameUser || this.isLoggedIn()) ? {display: 'block'}: {}}
                      // style={(!adminTrue ) ? {display: 'none'}: {}}
                    
                      // style={
                      //   (!isSameUser || !this.isLoggedIn()) ? {display: 'none'}: {}
                      //   }
                        >
                        <UncontrolledDropdown
                          
                        >
                      
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={e => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                        
                            <DropdownItem
                            >
                              <a className="text-danger" onClick={()=>this.onDelete(post._id)}>Remove</a >
                            </DropdownItem>
                            
                            <DropdownItem 
                            style={(isResolved ) ? {display: 'none'}: {} }
                            >
                              <a className="text-success" onClick={()=>this.onChangeStatus(post._id)}>Mark as Resolved </a>
                            </DropdownItem>
                            
                          </DropdownMenu>
                        </UncontrolledDropdown>
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
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader style={{backgroundRepeat: 'repeat', backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNarfhvpyI9_wzGSXbXUH5Yn0Q9CAApXoBz8sDxKapfADJkqbiDw")'}} className="border-0">
                  <Row>
                  <h3 className="mb-0">Posts</h3>
                  
                  <Button color="primary" disabled={this.props.name === 'Guest'} style={{marginLeft: "auto"}} onClick={this.toggle}>Create New Post</Button>
                  <Button color="danger" style={(!this.state.current_user || !this.state.current_user.userType || this.state.current_user.userType !== 'ADMIN') ?  {display: 'none'}: {}} >You are an Admin</Button>
 
                  </Row>  
                  <div>
                    
                      <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>Create a New Post</ModalHeader>
                        <ModalBody>
                          <Form role="form" onSubmit={this.onSubmit}>
                            <FormGroup>
                              <Label for="exampleEmail">Title</Label>
                              <Input  name="new_post_title"  value={this.state.new_post_title} onChange={this.handleInputChange} required placeholder="Type your topic here." />
                            </FormGroup>
                            <FormGroup>
                              <Label for="exampleText">Content</Label>
                              <Input type="textarea" name="new_post_content" value={this.state.new_post_content} onChange={this.handleInputChange} required placeholder="Type your message content here."/>
                            </FormGroup>
                            <ModalFooter>
                              <Button color="primary" type="submit">Post</Button>
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
                      <th scope="col">Creation Date</th>
                      <th scope="col" />
                    </tr>

    
                  </thead>
                  <tbody>
                    {table_rows}
                  </tbody>
                </Table>
                {/* <CardFooter className="py-4">
                  <nav aria-label="...">
                  <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem className="disabled">
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="active">
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          2 <span className="sr-only">(current)</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          3
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter> */}
              </Card>
            </div>
          </Row>
          
        </Container>
      </>
    );
  }
}

export default Tables;
