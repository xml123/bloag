import * as React from 'react'
import './style.scss'
import { Input,Select,InputNumber,Button,Tooltip,Icon } from 'antd'
const { Option } = Select

type IState = {
    capital:number,
    rate:number,
    time:number,
    interest_one:number
}


class LoanCounter extends React.Component<any,IState>{

    state = {time:30,rate:4.90,interest_one:0} as IState

    componentDidMount(){
        // this.counter(930000,300,0)
        // this.debx(1,300)
    }

    //等额本金
    counter_one = (all:number,num:number,rate:number,zlx:number,ylv:number) =>{
        if(num == 0){
            const zlx_float = parseFloat(zlx.toFixed(2))
            this.setState({
                interest_one:zlx_float
            })
            return
        }
        let lx = all*rate/12
        let sy = all - ylv
        let all_lx = zlx+lx
        this.counter_one(sy,num-1,rate,all_lx,ylv)
    }

    //等额本息
    debx(sum_l:number,n:number){
        const rate = 0.0588
        const bj = 930000
        if(n == 0){
            let yhk = bj*rate*sum_l/12/(sum_l-1)
            this.ylx(bj,yhk,300,0)
            return
        }
        let sum = (1+rate/12)*sum_l
        this.debx(sum,n-1)
    }
    //月利息
    ylx(bj:number,yhk:number,n:number,zlx:number){
        if(n == 0){
            console.log('zlx',zlx)
            return
        }
        const rate = 0.0588
        let lx = bj*rate/12
        let ye = bj - (yhk-lx)
        let sum_lx = zlx+lx
        this.ylx(ye,yhk,n-1,sum_lx)
    }

    //修改本金
    changeCapital(e:any){
        console.log(e.target.value)
        this.setState({
            capital:e.target.value
        })
    }

    //修改贷款时长
    changeTime(value:any){
        this.setState({
            time:value
        })
    }

    //修改利率
    changeRate(value:any){
        this.setState({
            rate:value
        })
    }

    //修改利率
    changeInput(e:any){
        this.setState({
            rate:e.target.value
        })
    }

    //计算
    counter = () =>{
        const {capital,time,rate} = this.state
        this.counter_one(capital*10000,time*12,rate/100,0,capital*10000/12/time)
    }


    render(){
        const {capital,time,rate,interest_one} = this.state
        return(
            <div>
                <h3 className="title">贷款计算器</h3>
                <div className="loanInfo">
                    <div className="loanLi"><span>贷款金额：</span><Input onChange={(e)=> this.changeCapital(e)} value={capital} placeholder="请输入数字" />万元</div>
                    <div className="loanLi"><span>贷款年限：</span><InputNumber onChange={(val) => this.changeTime(val)} value={time} min={1} max={80} />年</div>
                    <div className="loanLi">
                        <span>年利率：</span>
                        <Select onChange={(val:any) => this.changeRate(val)} style={{ width: 166 }} defaultValue="4.90"> 
                            <Option value="3.43">最新基准利率7折</Option>
                            <Option value="3.92">最新基准利率8折</Option>
                            <Option value="4.07">最新基准利率8.3折</Option>
                            <Option value="4.17">最新基准利率8.5折</Option>
                            <Option value="4.31">最新基准利率8.8折</Option>
                            <Option value="4.41">最新基准利率9折</Option>
                            <Option value="4.66">最新基准利率9.5折</Option>
                            <Option value="4.90">最新基准利率</Option>
                            <Option value="5.15">最新基准利率1.05倍</Option>
                            <Option value="5.39">最新基准利率1.1倍</Option>
                            <Option value="5.88">最新基准利率1.2倍</Option>
                            <Option value="6.37">最新基准利率1.3倍</Option>
                        </Select>
                        <Input value={rate} onChange={(e) => this.changeInput(e)} placeholder="也可输入数字" />%</div>
                    <div className="btnBox">
                        <Button type="primary" onClick={this.counter}>计算</Button>
                        <Button>重置</Button>
                    </div>
                </div>

                <div className="twoBox">
                    <div className="box_li">
                        <div className="loanli_title">等额本息还款
                            <Tooltip title="等额本息还款法，也称定期付息，即借款人每月按相等的金额偿还贷款本息，其中每月贷款利息按月初剩余贷款本金计算并逐月结清。">
                                <Icon type="info-circle" />
                            </Tooltip>
                        </div>
                        <div className="result">
                            <ul>
                                <li>
                                    <div className="loanLeftTitle">贷款总额</div>
                                    <div className="rightValue">{capital ? capital*10000 : capital}<span>元</span></div>
                                </li>
                                <li>
                                    <div className="loanLeftTitle">还款月数</div>
                                    <div className="rightValue">{time*12}<span>月</span></div>
                                </li>
                                <li>
                                    <div className="loanLeftTitle">每月还款</div>
                                    <div className="rightValue">930000<span>元</span></div>
                                </li>
                                <li>
                                    <div className="loanLeftTitle">总支付利息</div>
                                    <div className="rightValue">{isNaN(interest_one) ? '' : interest_one}<span>元</span></div>
                                </li>
                                <li>
                                    <div className="loanLeftTitle">本息合计</div>
                                    <div className="rightValue">{isNaN(capital+interest_one) ? '' : (capital+interest_one)}<span>元</span></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="box_li">
                        <div className="loanli_title">等额本金还款
                            <Tooltip title="等额本金还款法是在还款期内把贷款数总额等分，每月偿还同等数额的本金和剩余贷款在该月所产生的利息，这样由于每月的还款本金额固定，而利息越来越少，借款人起初还款压力较大，但是随时间的推移每月还款数也越来越少。">
                                <Icon type="info-circle" />
                            </Tooltip>
                        </div>
                        <div className="result">
                            <ul>
                                <li>
                                    <div className="loanLeftTitle">贷款总额</div>
                                    <div className="rightValue">{capital ? capital*10000 : capital}<span>元</span></div>
                                </li>
                                <li>
                                    <div className="loanLeftTitle">还款月数</div>
                                    <div className="rightValue">{time*12}<span>月</span></div>
                                </li>
                                <li>
                                    <div className="loanLeftTitle">首月还款</div>
                                    <div className="rightValue">930000<span>元</span></div>
                                </li>
                                <li>
                                    <div className="loanLeftTitle">总支付利息</div>
                                    <div className="rightValue">{isNaN(interest_one) ? '' : interest_one}<span>元</span></div>
                                </li>
                                <li>
                                    <div className="loanLeftTitle">本息合计</div>
                                    <div className="rightValue">{isNaN(capital+interest_one) ? '' : capital*10000+interest_one}<span>元</span></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LoanCounter