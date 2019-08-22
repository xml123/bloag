import * as React from 'react'
import './style.scss'
import HomeHeader from '../../layouts/headerBar'
import Footer from '../../layouts/footer'
import Body from '../../layouts/body'

type IProps = {
    match:any
    location:any
}

type IState = {
    title:string
}

class App extends React.Component<IProps,IState>{
    constructor(props: IProps) {
        super(props);
    }
    state = {
        title:''
    }
    componentDidMount(){
        this.setState({
            title:this.props.match.params.id
        })
    }
    componentWillReceiveProps(nextProps:any) {
        if (nextProps.location.pathname != this.props.location.pathname) {
            this.setState({
                title:nextProps.match.params.id
            })
        } 
     }   
    render(){
        console.log('title',this.state.title)
        return(
            <div>
                <HomeHeader />
                <Body title={this.state.title}/>
                <Footer />
            </div>
        )
    }
}

export default App