import * as React from 'react'
import './style.scss'
import avator from '../../assets/images/ruanyifeng.png'
import axios from 'axios'
import config from '../../../config/index'
import { Input,Button } from 'antd'
const { TextArea } = Input

type IItem = {
    id:number,
    message:string,
    time:string,
    visitor:any
}

type IProps = {
    id:number
}

type IState = {
    messageList:IItem[],
    code:string
}

class ArticalMessage extends React.Component<IProps,IState>{
    constructor(props: IProps) {
        super(props);
    }

    state = {} as IState

    componentDidMount(){
        const {id} = this.props
        this.getMessageList(id)
    }

    componentWillReceiveProps(nextProps:any){
        if(this.props.id !== nextProps.id){
            this.getMessageList(nextProps.id)
        }
    }

    //获取文章评论列表
    getMessageList(id:number){
        axios.post(config.API_BASE_URL+'/api/get_artical_message',{id:id},
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            if(res.data.code == '200'){
                this.setState({
                    messageList:res.data.data,
                    code:res.data.code
                })
            }
        })
        .catch(function(err){
            console.log(err)
        })
        this.addViewContent(id)
    }

    //增加阅读量
    addViewContent(id:number){
        axios.post(config.API_BASE_URL+'/api/add_artical_view',{id:id},
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            console.log('欢迎来到bright的博客......')
        })
        .catch(function(err){
            console.log(err)
        })
    }

    render(){
        const {code, messageList} = this.state
        return(
            <div className="articalMessage">
                <div className="messageHeader">
                    <div className="messageName">文章评论</div>
                    <div className="messageCount">3条评论</div>
                </div>
                <div className="inputMessage">
                    <div className="avatorBox">
                        <img src={avator} alt="avator" />
                    </div>
                    <div className="textarea">
                        <TextArea placeholder="说点什么" rows={4} />
                    </div>
                </div>
                <div className="putMessageBtn">
                    <Button type="primary">评论</Button>
                </div>
                {code == '200' && <div className="messageList">
                    {messageList.map(item=>{
                        return(
                            <div className="messageLi" key={item.id}>
                                <div className="avatorBox">
                                    <img src={item.visitor.avatar} alt="avatar" />
                                </div>
                                <div className="messageContent">
                                    <div className="userInfo">
                                        <span className="userName">{item.visitor.name}</span>
                                        <span className="mseeageTime">发表于：{item.time}</span>
                                    </div>
                                    <div className="messageText">{item.message}</div>
                                    <div className="userInfo">
                                        <span className="userName">章三</span>
                                        <span className="mseeageTime">回复</span>
                                        <span className="userName">李四</span>
                                        ：
                                    </div>
                                    <div className="messageText">你啊数据大阿三等奖爱仕达大撒阿斯顿你啊数据大阿三等奖爱仕达大撒阿斯顿</div>
                                </div>
                            </div>
                        )
                    })}
                </div>}
            </div>
        )
    }
}

export default ArticalMessage