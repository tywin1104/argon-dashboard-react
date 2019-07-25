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
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  UncontrolledTooltip
} from "reactstrap";
// core components
import Header from "components/Headers/Header.jsx";
import axios from 'axios'

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
                  {post.title}
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
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  Action
                </DropdownItem>
                <DropdownItem
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  Another action
                </DropdownItem>
                <DropdownItem
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  Something else here
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
                  <h3 className="mb-0">Card tables</h3>
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
                <CardFooter className="py-4">
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
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Tables;
