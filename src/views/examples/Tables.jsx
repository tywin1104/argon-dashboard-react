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
  Button
} from "reactstrap";
// core components
import Header from "components/Headers/Header.jsx";
import axios from 'axios'
import {Link} from 'react-router-dom'

class Tables extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: []
    };
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
    let table_rows = posts.map((post)=> {
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
                {/* <Link
                  to={{ pathname: '/admin/mentor/'+post._id}}
                  key={post._id}>
                  Check Details
                 </Link> */}
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
                  {/* <Button color="primary">Add new post</Button> */}
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
