import * as React from 'react'
import './style.scss'
import avator from '../../assets/images/ruanyifeng.png'
import axios from 'axios'
import config from '../../../config/index'
import { Input,Button,Icon,message } from 'antd'
import {GetUrl} from '../../assets/js/tool'
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
    code:string,
    name:string,
    avator_link:string,
    html_link:string,
    comment:string
}

class ArticalMessage extends React.Component<IProps,IState>{
    constructor(props: IProps) {
        super(props);
    }

    state = {
        name:localStorage.getItem("userName"),
        avator_link:localStorage.getItem("avatar_url"),
        html_link:localStorage.getItem("html_link")
    } as IState

    componentDidMount(){
        const {id} = this.props
        this.getMessageList(id)
        this.getUrl()
    }

    getUrl(){
        if(!localStorage.getItem("loginStatus")){
            const urlSeqarch = window.location.search
            const value = GetUrl(urlSeqarch,'code')
            if(!value){
                return
            }
            axios.post(config.API_BASE_URL+'/api/get_code',{code:value},
            {headers: {'Content-Type': 'application/json'}})
            .then(res => {
                const res_data = res.data
                if(res_data.code == '200'){
                    this.setState({
                        name:res_data.data.name,
                        avator_link:res_data.data.avatar_url,
                        html_link:res_data.data.html_link
                    })
                    localStorage.setItem("loginStatus","1")
                    localStorage.setItem("userName",res_data.data.name)
                    localStorage.setItem("avatar_url",res_data.data.avatar_url)
                    localStorage.setItem("html_link",res_data.data.html_link)
                }
            })
            .catch(function(err){
                console.log(err)
            })
        }
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

    login(){
        const thisHref = window.location.href
        window.location.href="https://github.com/login/oauth/authorize?client_id=0fd0f7869375ba937215&redirect_uri="+thisHref
    }

    //添加评论
    addComment = () => {
        const {name,comment} = this.state
        const {id} = this.props
        if(!name){
            return message.warning('请先登录!')
        }
        if(!comment){
            return message.warning('请先输入评论内容!')
        }
        axios.post(config.API_BASE_URL+'/api/add_artical_message',{artical_id:id,name:name,comment:comment})
        .then(res => {
            message.success('评论成功！')
            this.setState({
                comment:''
            })
            this.getMessageList(id)
        })
        .catch(function(err){
            console.log(err)
        })
    }

    render(){
        const {code, messageList, name, avator_link, html_link,comment} = this.state
        return(
            <div className="articalMessage">
                <div className="messageHeader">
                    <div className="messageName">文章评论</div>
                    <div className="messageCount"><span>{messageList ? messageList.length : 0}</span>条评论</div>
                    <div className="userName">{name ? name : '未登录'}</div>
                </div>
                <div className="inputMessage">
                    <div className="avatorBox">
                        {name && <a href={html_link} target="_black"><img src={avator_link as any} alt="avator" /></a>}
                        {!name && <Icon type="github" />}
                    </div>
                    <div className="textarea">
                        <TextArea onChange={(e) => {
                            this.setState({
                                comment:e.target.value
                            })
                        }} value={comment} placeholder="说点什么" rows={4} />
                    </div>
                </div>
                <div className="putMessageBtn">
                    {!name && <Button type="primary" className="loginBtn" onClick={this.login}>github登录</Button>}
                    <Button onClick={this.addComment} type="primary">评论</Button>
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