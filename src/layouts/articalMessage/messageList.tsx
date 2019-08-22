import * as React from 'react'
import './style.scss'

type IItem = {
    id:number,
    message:string,
    time:string,
    visitor:any,
    child_message_list:any
}

type IProps = {
    messageList:IItem[],
    changeReplay:any
}

class MessageList extends React.Component<IProps,any>{
    constructor(props: IProps) {
        super(props)
    }

    render(){
        const {messageList,changeReplay} = this.props
        return(
            <div className="messageList">
                {messageList.map(item=>{
                    return(
                        <div className="messageLi" key={item.id}>
                            <div className="avatorBox">
                                <a href={item.visitor.link} target="_black">
                                    <img src={item.visitor.avatar} alt="avatar" />
                                </a>
                            </div>
                            <div className="messageContent">
                                <div className="userInfo">
                                    <span className="userName">{item.visitor.name}</span>
                                    <span className="mseeageTime">发表于：{item.time}</span>
                                    <span className="right_replay" onClick={()=>changeReplay(item.visitor.name,item.id)}>评论</span>
                                </div>
                                <div className="messageText">{item.message}</div>
                                {item.child_message_list.length > 0 && (
                                    item.child_message_list.map((item2:any) => {
                                        return(
                                            <div>
                                                <div className="avatorBox">
                                                    <a href={item2.visitor.link} target="_black">
                                                        <img src={item2.visitor.avatar} alt="avatar" />
                                                    </a>
                                                </div>
                                                <div className="child_content">
                                                    <div className="userInfo">
                                                        <span className="userName">{item2.visitor.name}</span>
                                                        <span className="mseeageTime">回复于：{item2.time}</span>
                                                    </div>
                                                    <div className="messageText">{item2.message}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default MessageList