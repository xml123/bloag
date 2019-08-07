import * as React from 'react'
import './style.scss'
import "antd/dist/antd.css"
import { Menu, Dropdown, Icon } from 'antd'
import {Link} from 'react-router-dom'
import axios from 'axios'
import config from '../../../config/index'
import {IHeader,CHANGE_STATUS,IStoreState} from '../../store'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import store from '../../index'

type IListItem = {
  id:number
  title:String
  type:String
}

type IState = {
  
}

type IProps = {
  headStatus:boolean,
  jsList:[],
  afterList:[],
  otherList:[],
}

function axios1():any{
  return axios.post(config.API_BASE_URL+'/api/get_head_list',
        {type:'前端技术'},
        {headers: {'Content-Type': 'application/json'}}
    )
}

function axios2():any{
  return axios.post(config.API_BASE_URL+'/api/get_head_list',
        {type:'后端技术'},
        {headers: {'Content-Type': 'application/json'}}
      )
}

function axios3():any{
  return axios.post(config.API_BASE_URL+'/api/get_head_list',
        {type:'杂谈'},
        {headers: {'Content-Type': 'application/json'}}
      )
}
function listTest(list:IListItem[]):any{
  return list.map((item:IListItem)=>{
    return (<Menu.Item key={item.id}>
      <Link rel="noopener noreferrer" to={'/artical/'+item.title}>
        {item.title}
      </Link>
    </Menu.Item>)
  })
}
class HeadBar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
      super(props);
    }
    static contextTypes = {
      store: PropTypes.object
    }

    state = {} as IState

    componentDidMount(){
      const that = this
      if(!that.props.headStatus){
        axios.all([axios1(),axios2(),axios3()])
        .then(axios.spread((res1,res2,res3) => {
          const jsList = res1.data.data
          const afterList = res2.data.data
          const otherList = res3.data.data
          let headerList:IHeader = {
            jsList,
            afterList,
            otherList,
          }
          if(res1.data.code == '200' && res2.data.code == '200' && res3.data.code == '200'){
            store.dispatch({
              type:CHANGE_STATUS,
              headerList
            })
          }
        }))
        .catch(function(err){
          console.log(err)
        })
      }
    }

    // shouldComponentUpdate(nextProps:any,nextState:any):boolean{
    //   console.log('should',nextProps.headStatus)
    //   if(nextProps.headStatus){
    //     return false
    //   }else{
    //     return true
    //   }
    // }
    render() {
      const {jsList,afterList,otherList} = this.props
      return (
        <div className='header'>
          <div className="headerLeft">bright</div>
          <div className="headerRight">
            <Link to="/home">首页</Link>
            <Dropdown overlay={<Menu>{listTest(jsList)}</Menu>}>
                <Link className="ant-dropdown-link" to="#">
                前端技术 <Icon type="down" />
                </Link>
            </Dropdown>
            <Dropdown overlay={<Menu>{listTest(afterList)}</Menu>}>
                <a className="ant-dropdown-link" href="#">
                后端技术 <Icon type="down" />
                </a>
            </Dropdown>
            <Dropdown overlay={<Menu>{listTest(otherList)}</Menu>}>
                <a className="ant-dropdown-link" href="#">
                杂谈 <Icon type="down" />
                </a>
            </Dropdown>
            <Link to="/friend">友情链接</Link>
            <Link to="/message">留言</Link>
            <a href="https://github.com/xml123/bloag" target="_blank"><Icon type="github" style={{ fontSize: '24px'}}  /></a>
          </div>
        </div>
      )
    }
}
const mapStateToProps = (state: IStoreState) => {
  return {
    headStatus: state.headStatus,
    jsList:state.jsList,
    afterList:state.afterList,
    otherList:state.otherList
  }
}
export default connect(mapStateToProps)(HeadBar)