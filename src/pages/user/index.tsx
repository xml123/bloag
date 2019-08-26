import * as React from 'react'
import HomeHeader from '../../layouts/headerBar'
import './style.scss'
import ArticalLogin from '../../layouts/articalMessage/login'
import MessageList from '../../layouts/articalMessage/messageList'
import axios from 'axios'
import config from '../../../config/index'

type IProps = {

}

type IState = {
    messageList:[],
    code:string,
    replay_name:string,
    replay_id:number
}

class User extends React.Component<IProps,IState>{
    constructor(props: IProps) {
        super(props);
        this.getMessageList = this.getMessageList.bind(this)
        this.changeReplay = this.changeReplay.bind(this)
    }

    state = {} as IState

    componentDidMount(){
        this.getMessageList()
    }

    getMessageList(){
        const that = this
        axios.get(config.API_BASE_URL+'/api/get_live_message')
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
    }

    changeReplay(name:string,replayId:number){
        const that = this
        that.setState({
            replay_name:name,
            replay_id:replayId
        })
    }


    render(){
        const {messageList,code,replay_name,replay_id} = this.state
        return(
            <div className="userBody">
                <HomeHeader />
                <div className="user">
                    <h2 className="userAbs_title">个人简介</h2>
                    <div className="user_info">
                        <h3>工作经历</h3>
                        <div className="userInfo_li">徐明亮</div>
                        <div className="userInfo_li">2019.08~至今，诺迪克（上海）健身器材有限公司，js全栈开发工程师</div>
                        <div className="userInfo_li">2018.02~2019.07，杭州地普好森科技有限公司（房88），前端开发工程师</div>
                        <div className="userInfo_li">2017.01~2018.01，杭州泓唛网络科技有限公司，前端开发工程师</div>
                        <div className="userInfo_li">2016.05~2018.01，杭州庆协投资管理有限公司，前端开发工程师</div>
                        <h3>教育情况</h3>
                        <div className="userInfo_li">2012.09～2016.06，西安思源学院，交通运输专业，全日制本科</div>
                        <div className="userInfo_li">在校多次获得国家奖学金，获得陕西省全国工程能力竞赛一等奖</div>
                        <h3>个人说明</h3>
                        <div className="userInfo_li">自学技术，在前端领域摸爬滚打三年有余，标准宅男，直男癌晚期😂😂，热爱技术，喜欢打打游戏，看看小说，痴迷动漫</div>
                        <div className="userInfo_li">有责任心，喜欢钻研新技术，业余时间接各种私人或者外包项目，绝对做到满意😄😄～</div>
                        <div className="userInfo_li">有添加友链或者商务合作的可下方留言，或者下方扫码加我微信，请备注来意，或者发我邮箱<span>xumingliang@fang88.me</span></div>
                        <h3>个人社交网站</h3>
                        <div className="user_link">
                            <div className="userInfo_li"><a href="https://www.zhihu.com/people/xml-86-69/activities" target="_black">知乎</a></div>
                            <div className="userInfo_li"><a href="https://github.com/xml123" target="_black">github</a></div>
                            <div className="userInfo_li"><a href="https://www.proginn.com/wo/343918" target="_black">程序员客栈</a></div>
                            <div className="userInfo_li"><a href="https://www.yuanjisong.com/consultant/172746" target="_black">猿急送</a></div>
                        </div>
                    </div>
                    <h2 className="live_message_title">留言</h2>
                    <div className="live_message_all">
                        {messageList && <ArticalLogin messageLength={messageList.length} id={undefined}  getMessageList={this.getMessageList} replayName={replay_name} replayId={replay_id} />}
                        {code == '200' && <MessageList messageList={messageList} changeReplay={this.changeReplay} />}
                    </div>
                </div>
            </div>
        )
    }
}

export default User