import * as React from 'react'
import * as style from './style.scss'
import HomeHeader from '../../layouts/headerBar'
import Footer from '../../layouts/footer'
import { Icon, Pagination } from 'antd'
import './style.scss'
import axios from 'axios'
import config from '../../../config/index'

interface IProps {
    style: React.CSSProperties
}

type IItem = {
    id:number,
    title:string,
    view:number,
    content:string,
    time:string,
    type:string
}

type IState = {
    articalList:IItem[],
    status:string,
    total:number
}

function itemRender(current:number, type:string, originalElement:any) {
    if (type === 'prev') {
      return <a>上一页</a>;
    }
    if (type === 'next') {
      return <a>下一页</a>;
    }
    return originalElement;
}

class App extends React.Component<IProps,IState> {
    constructor(props: IProps) {
        super(props);
    }

    state = {total:0} as IState

    getAllArtical(pageNum=1){
        axios.post(config.API_BASE_URL+'/api/get_all_artical',{pageNum})
        .then(res => {
            this.setState({
                articalList:res.data.data,
                status:res.data.code,
                total:res.data.total
            })
            document.documentElement.scrollTop = document.body.scrollTop =0
        })
        .catch(function(err){
            console.log(err)
        })
    }

    componentDidMount(){
        this.getAllArtical()
    }

    onChangePage(page:number,pageSize:any):void{
        this.getAllArtical(page)
    }

    render() {
      const {articalList,status,total} = this.state
      return (
        <div className={style.wrapper}>
            <HomeHeader />
            <div className="homeBody">
                <ul className="keyArtical">
                    {status == '200' && articalList.map(item => {
                        return(
                        <li className="keyLi" key={item.id}>
                            <h1 className="articalName">
                                <a href="#">{item.title}</a>
                            </h1>
                            <div className="articalInfo">
                                <div className="infoLi">
                                    <Icon type="clock-circle" />
                                    <span>{item.time}</span>
                                </div>
                                <div className="infoLi">
                                    <Icon type="eye" />
                                    <span>{item.view}</span>
                                </div>
                                <div className="infoLi">
                                    <Icon type="tag" />
                                    <span>{item.type}</span>
                                </div>
                            </div>
                            <div className="articalAbstract" dangerouslySetInnerHTML={{__html:item.content}} />
                            <div className="readMoreBtn">
                                <a href="#">Read more</a>
                            </div>
                            <div className="post-eof"></div>
                        </li>
                        )
                    })}
                </ul>
                <div className="pages">
                    <Pagination pageSize={5} onChange={(page,pageSize) => this.onChangePage(page,pageSize)} total={total} itemRender={itemRender} hideOnSinglePage={true} />
                </div>
            </div>
            <Footer />
        </div>
      )
    }
  }
  
  export default App