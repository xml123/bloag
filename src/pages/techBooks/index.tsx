import * as React from 'react'
import './style.scss'
import axios from 'axios'
import QRCode from 'qrcode.react';
type IProps = {}

type IState = {
    qrcode:any,
    token:any
}

class TechBooks extends React.Component<IProps,IState>{
    constructor(props: IProps) {
        super(props);
    }
    state = {} as IState
    componentDidMount(){
        this.getImg()
    }

    UrlSearch(url:string){
        console.log('url',url)
        var num=url.indexOf("?")
        url=url.substr(num+1)
        let obj = {} as any
        var arr=url.split("&")
        for(var i=0;i < arr.length;i++){
             num=arr[i].indexOf("=")
             if(num>0){
                 obj[arr[i].substring(0,num)] = arr[i].substr(num+1)
             }
         }
         return obj
     } 

    getImg(){
        const that = this
        axios.get('/wechat/get_img')
        .then(function (response) {
            let token = that.UrlSearch(response.data).state
            console.log('token',token)
            that.setState({
                qrcode:response.data,
                token
            })
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    render(){
        const {qrcode} = this.state
        return(
            <div className="books">
                {/* <HomeHeader/> */}
               {qrcode && <div className="booksBox">
                    <QRCode value={qrcode} />
                </div>
               }
            </div>
        )
    }
}

export default TechBooks