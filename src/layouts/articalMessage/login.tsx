import * as React from 'react'
import './style.scss'
import axios from 'axios'
import config from '../../../config/index'
import { Input,Button,Icon,message } from 'antd'
import {GetUrl} from '../../assets/js/tool'
const { TextArea } = Input

type IProps = {
    messageLength:number,
    id:number,
    getMessageList:any,
    replayName:string,
    replayId:any
}

type IState = {
    html_link:string,
    avator_link:string,
    comment:string,
    name:string
}

class ArticalLogin extends React.Component<IProps,IState>{
    constructor(props: IProps) {
        super(props);
    }

    state = {
        name:localStorage.getItem("userName"),
        avator_link:localStorage.getItem("avatar_url"),
        html_link:localStorage.getItem("html_link")
    } as IState

    componentDidMount(){
        this.getUrl()
    }

    //回复
    componentWillReceiveProps(nextProps:any){
        if(this.props.replayName !== nextProps.replayName){
            let comment = '@'+nextProps.replayName+`\n`
            const myComment = this.refs.myComment as any
            myComment.focus()
            this.setState({
                comment:comment
            })
        }
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

    //添加评论
    addComment = () => {
        const {name,comment} = this.state
        const {id,replayId} = this.props
        let post_comment = comment
        let replay_id = ''
        if(!name){
            return message.warning('请先登录!')
        }
        if(comment.indexOf('@') == 0){
            const index = comment.indexOf(`\n`)
            post_comment = comment.slice(index+1)
            replay_id = replayId
        }
        if(!post_comment){
            return message.warning('请先输入评论内容!')
        }
        axios.post(config.API_BASE_URL+'/api/add_artical_message',{artical_id:id,name:name,comment:post_comment,replay_id:replay_id})
        .then(res => {
            message.success('评论成功！')
            this.setState({
                comment:''
            })
            this.props.getMessageList(id)
        })
        .catch(function(err){
            console.log(err)
        })
    }

    login(){
        const thisHref = window.location.href
        window.location.href="https://github.com/login/oauth/authorize?client_id=0fd0f7869375ba937215&redirect_uri="+thisHref
    }

    render(){
        const {messageLength} = this.props
        const {html_link,avator_link,comment,name} = this.state
        return (
            <div>
                <div className="messageHeader">
                    <div className="messageName">文章评论</div>
                    <div className="messageCount"><span>{messageLength}</span>条评论</div>
                    <div className="userName">{name ? name : '未登录'}</div>
                </div>
                <div className="inputMessage">
                    <div className="avatorBox">
                        {name && <a href={html_link} target="_black"><img src={avator_link as any} alt="avator" /></a>}
                        {!name && <Icon type="github" />}
                    </div>
                    <div className="textarea">
                        <TextArea ref="myComment" onChange={(e) => {
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
            </div>
        )
    }
}

export default ArticalLogin
