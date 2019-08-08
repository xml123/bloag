import * as React from 'react'
import './style.scss'
import {Icon} from 'antd'

class App extends React.Component<any> {
    render() {
      return (
        <div className="footer">
          {/* <div className="otherLink">
            <a href="#">
              <Icon type="github" style={{ fontSize: '36px'}} />
            </a>
            <a href="#">
              <Icon type="twitter" style={{ fontSize: '36px'}} />
            </a>
            <a href="#">
              <Icon type="zhihu" style={{ fontSize: '36px'}} />
            </a>
            <a href="#">
              <Icon type="facebook" style={{ fontSize: '36px'}} />
            </a>
            <a href="#">
              <Icon type="linkedin" style={{ fontSize: '36px'}} />
            </a>
          </div> */}
          <div className="footerCopy">Copyright © 2019 - bright</div>
        </div>
      )
    }
}
  
export default App