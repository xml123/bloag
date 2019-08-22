import * as React from 'react'
import './style.scss'
import axios from 'axios'
import config from '../../../config/index'
import ArticalLogin from './login'
import MessageList from './messageList'

type IProps = {
    id:number,
}

type IState = {
    messageList:[],
    code:string,
    replay_name:string,
    replay_id:number
}

class ArticalMessage extends React.Component<IProps,IState>{
    constructor(props: IProps) {
        super(props);
        this.getMessageList = this.getMessageList.bind(this)
        this.changeReplay = this.changeReplay.bind(this)
    }

    state = {replay_name:''} as IState

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
        const that = this
        axios.post(config.API_BASE_URL+'/api/get_artical_message',{id:id},
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            if(res.data.code == '200'){
                that.setState({
                    messageList:res.data.data,
                    code:res.data.code
                })
            }
        })
        .catch(function(err){
            console.log(err)
        })
        that.addViewContent(id)
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

    changeReplay(name:string,replayId:number){
        const that = this
        that.setState({
            replay_name:name,
            replay_id:replayId
        })
    }

    render(){
        const {code, messageList,replay_name,replay_id} = this.state
        const {id} = this.props
        return(
            <div className="articalMessage">
                {messageList && <ArticalLogin messageLength={messageList.length} id={id} getMessageList={this.getMessageList} replayName={replay_name} replayId={replay_id} />}
                {code == '200' && <MessageList messageList={messageList} changeReplay={this.changeReplay} />}
            </div>
        )
    }
}

export default ArticalMessage