import * as React from 'react'
import './style.scss'
import axios from 'axios'
import config from '../../../config/index'
import ArticalMessage from '../../layouts/articalMessage'
import {Icon} from 'antd'
import {GetUrl} from '../../assets/js/tool'

type IProps = {
    title:string
}

type IList = {
    id:number,
    title:string,
    content:string,
    view:number,
    time:string,
    type:string
}

type IState = {
    list:IList[],
    code:string,
    articalNum:number,
    articalId:number
}



export default class App extends React.Component<IProps,IState>{
    constructor(props: IProps) {
        super(props);
    }

    state = {articalNum:0,articalId:0} as IState

    getArticalList = (title:string) => {
        const urlSeqarch = window.location.search
        const artical_id = GetUrl(urlSeqarch,'artical_id')
        if(!title){
            return
        }
        axios.post(config.API_BASE_URL+'/api/get_artical_type_list',{type:title},{
            headers: {'Content-Type': 'application/json'}})
        .then((res) => {
            if(res.data.code === '200'){
                const res_obj = res.data.data
                let articalId = res_obj[0].id
                let articalNum = 0
                if(artical_id){
                    articalId = artical_id
                    for(let i=0;i<res_obj.length;i++){
                        if(res_obj[i].id == artical_id){
                            console.log(i)
                            articalNum = i
                            break 
                        }
                    }
                }
                this.setState({
                    list:res_obj,
                    code:res.data.code,
                    articalId:res_obj[0].id,
                    articalNum:articalNum
                }) 
            }
        })
        .catch(function(err){
            console.log(err)
        })
    }

    componentDidMount(){
        this.getArticalList(this.props.title)
    }
    componentWillReceiveProps(nextProps:any) {
        this.getArticalList(nextProps.title)
     }
    changeArtical = (e:any) => {
        const index = e.target.getAttribute('data-index')
        const articalId = e.target.getAttribute('data-num')
        const {articalNum} = this.state
        if(articalNum == index){
            return
        }
        this.setState({
            articalNum:index,
            articalId:articalId
        })
    }
    render(){
        const {list,code,articalNum,articalId} = this.state
        return(
            <div className="bodyBox">
                <div className="bodyLeft">
                    <ul className="leftOneList">
                        {code == '200' && list.map((item,index) => {
                            return (
                                <li className={index == articalNum ? 'active':''} key={item.id} data-num={item.id} data-index={index} onClick={(e) => {
                                    this.changeArtical(e)
                                }}>{item.title}</li>
                            )})
                        }
                    </ul>
                </div>
                {code == '200' && <div className="bodyRight">
                    <div className="rightBox">
                        <div className="articalBody">
                            <h2 className="articalTitle">{ list[articalNum].title }</h2>
                            <div className="articalInfo">
                                <div className="infoLi">
                                    <Icon type="clock-circle" />
                                    <span>{list[articalNum].time}</span>
                                </div>
                                <div className="infoLi">
                                    <Icon type="eye" />
                                    <span>{list[articalNum].view}</span>
                                </div>
                            </div>
                            <div dangerouslySetInnerHTML={{__html:list[articalNum].content}} />
                        </div>
                        <ArticalMessage id={articalId} />
                    </div>
                </div>
                }
            </div>
        )
    }
}