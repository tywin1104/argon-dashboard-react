
import React from "react";
import {
    Card,
    CardHeader,
    Container,
    Row,
    Button
  
  } from "reactstrap";
  import {  Header as Header1, Icon, Image, Modal } from 'semantic-ui-react'
  // core components
  import Header from "components/Headers/Header.jsx";
  import "../../assets/css/lunchMenu.css"
  import axios from "axios";


class LunchMenu extends React.Component {
    constructor() {
        super();
        this.state = {
            lunchMenu: {images:[], timestamp: ''}
        }
    }

    componentWillMount() {
        axios.get('/api/lunchMenus/')
            .then((res)=> {
                if(res.status === 200) {
                    this.setState({
                        lunchMenu: res.data.menus[res.data.menus.length-1]
                    })
                }
            })
    }


    render() {
        return (
            <>
              <Header />
              {/* Page content */}
              
              <Container className="mt--7" fluid>
                {/* Table */}
               
                <Row>
                  <div className="col">
                    <Card className="shadow">
                      <CardHeader><h1 className="text-center">Lunch Menu</h1>
                      </CardHeader>
                      <div className="row menuWrapper" >
                          <div className="col-4">
                            <h3>Dinning Hall1</h3>
                            <img src={this.state.lunchMenu.images[0]}></img>
                          
                          </div>
                          <div className="col-4">
                          <h3>Dinning Hall1</h3>
                          <img src={this.state.lunchMenu.images[1]}></img>

                          </div>
                          <div className="col-4">
                          <h3>Dinning Hall1</h3>
                          <img src={this.state.lunchMenu.images[2]}></img>
                          </div>
                      </div>
                       </Card>
                   </div>
                  </Row>
          
        </Container>
      
            </>
          );
  
    }
}

export default LunchMenu;