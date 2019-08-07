import * as React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
//import LiveRoute from 'react-live-route'
import HomePage from '../../src/pages/home'
import Friend from '../../src/pages/friend'
import Message from '../../src/pages/message'
import ArticalDetail from '../../src/pages/articalDetail'

const AppRoutes = () => (
    <Router forceRefresh={false}>
        <div>
            <Route exact path="/" component={HomePage} />
            <Route path="/home" component={HomePage} />
            <Route path="/friend" component={Friend} />
            <Route path="/message" component={Message} />
            <Route path="/artical/:id" component={ArticalDetail} />
        </div>
    </Router>
)

class Slider extends React.Component {
    state = { pos: 0, pageIndex: 0 }
  
    render() {
      return (
        <React.Fragment>
            <AppRoutes />
        </React.Fragment>
      )
    }
  }
  
  export default Slider
