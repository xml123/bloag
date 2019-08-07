import * as React from 'react'
import './style.scss'
import axios from 'axios'
import config from '../../../config/index'

type IProps = {
    title:string
}

type IList = {
    id:number,
    title:string,
    content:string,
    view:number,
    time:string
}

type IState = {
    list:IList[],
    code:string,
    articalNum:number
}



export default class App extends React.Component<IProps,IState>{
    constructor(props: IProps) {
        super(props);
    }

    state = {articalNum:0} as IState

    getArticalList = (title:string) => {
        if(!title){
            return
        }
        axios.post(config.API_BASE_URL+'/api/get_artical_type_list',{type:title},{
            headers: {'Content-Type': 'application/json'}})
        .then((res) => {
            if(res.data.code === '200'){
                this.setState({
                    list:res.data.data,
                    code:res.data.code
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
        const index = e.target.getAttribute('data-id')
        this.setState({
            articalNum:index
        })
    }
    render(){
        const {list,code,articalNum} = this.state
        return(
            <div className="bodyBox">
                <div className="bodyLeft">
                    <ul className="leftOneList">
                        {code == '200' && list.map((item,index) => {
                            return (
                                <li className={index == articalNum ? 'active':''} key={item.id} data-id={index} onClick={(e) => {
                                    this.changeArtical(e)
                                }}>{item.title}</li>
                            )})
                        }
                    </ul>
                </div>
                {code == '200' && <div className="bodyRight">
                    <h2 className="articalTitle">{ list[articalNum].title }</h2>
                    <div dangerouslySetInnerHTML={{__html:list[articalNum].content}} />
                </div>
                }
            </div>
        )
    }
}