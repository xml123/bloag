import * as React from 'react'
import './style.scss'
import * as echarts from 'echarts'
import { Input,Select,InputNumber,Button,Tooltip,Icon } from 'antd'
const { Option } = Select

type IState = {
    capital:any,
    rate:number,
    time:number,
    interest_one:number,
    two_obj:any,
    one_obj:any,
    data_list1:any,
    data_list2:any,
    lx_list1:any,
    lx_list2:any,
    bj_list1:any,
    bj_list2:any
}

interface IProps {
    style: React.CSSProperties
}


class LoanCounter extends React.Component<IProps,IState>{
    constructor(props: IProps) {
        super(props);
    }

    state = {time:30,rate:4.90,interest_one:0} as IState

    componentDidMount(){
        // this.counter(930000,300,0)
        // this.debx(1,300)
    }

    //等额本金
    //this.counter_one(capital*10000,time*12,rate/100,0,capital*10000/12/time)
    counter_one = (all:number,num:number,rate:number,yhk:number) =>{
        const that = this
        let sy_count = all
        let all_lx = 0
        let de_ze = []
        let lx_list = []
        let bj_list = []
        for(let i=0;i<num;i++){
            let yh_ze = (sy_count+all_lx+i*all/num).toFixed(2)
            let lx = sy_count*rate/12
            sy_count = sy_count - yhk
            all_lx = all_lx+lx
            de_ze.push(yh_ze)
            lx_list.push(lx.toFixed(2))
            bj_list.push((all/num).toFixed(2))
        }
        const zlx_float = parseFloat(all_lx.toFixed(2))
        const all_count = all + zlx_float
        const syhk = (all*rate/12+all/num).toFixed(2)
        const ydj = (all/num*rate/12).toFixed(2)
        this.setState({
            data_list1:de_ze,
            lx_list1:lx_list,
            bj_list1:bj_list,
            two_obj:{
                count:all,
                time:num,
                yhk:syhk,
                zlx:zlx_float,
                hj:all_count,
                ydj:ydj
            }
        },function(){that.drawEchart()})
    }

    //等额本息
    debx(bj:number,rate:number,time:number){
        let sum = 1
        for(let i = 0;i<time;i++){
            sum = (1+rate/12)*sum
        }
        let yhk = bj*rate*sum/12/(sum-1)
        this.ylx(bj,rate,yhk,time)
    }

    //总利息
    ylx(bj:number,rate:number,yhk:number,time:number){
        let cartil_count = bj
        let sum_lx = 0
        let dq_ze = []
        let lx_list = []
        let bj_list = []
        for(let i=0;i<time;i++){
            let lx = cartil_count*rate/12
            let dy_ze = (yhk*i+cartil_count).toFixed(2)
            cartil_count = cartil_count - (yhk-lx)
            sum_lx = sum_lx+lx
            dq_ze.push(dy_ze)
            lx_list.push(lx.toFixed(2))
            bj_list.push((yhk-lx).toFixed(2))
        }
        const zlx_float = parseFloat(sum_lx.toFixed(2))
        const all_count = bj+ zlx_float
        const y_hk = (all_count/time).toFixed(2)
        this.setState({
            data_list2:dq_ze,
            lx_list2:lx_list,
            bj_list2:bj_list,
            one_obj:{
                count:bj,
                time:time,
                yhk:y_hk,
                zlx:zlx_float,
                hj:all_count
            }
        })
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
    //下拉框修改利率
    changeRate(value:any){
        this.setState({
            rate:value
        })
    }
    //输入框修改利率
    changeInput(e:any){
        this.setState({
            rate:e.target.value
        })
    }

    //计算
    counter = () =>{
        const {capital,time,rate} = this.state
        this.counter_one(capital*10000,time*12,rate/100,capital*10000/12/time)
        this.debx(capital*10000,rate/100,time*12)
    }
    //重置
    clear = () => {
        this.setState({
            capital:null,
            rate:4.9,
            time:30
        })
    }

    //画图
    drawEchart(){
        const {data_list1,time,data_list2,lx_list1,lx_list2,bj_list1,bj_list2} = this.state
        const myChart = echarts.init(document.getElementById('main') as any)
        const myChart2 = echarts.init(document.getElementById('main2') as any)

        //计算横坐标轴
        let x_array = []
        for(let i=1;i<time*12;i++){
            x_array.push('第'+i+'期')
        }

        myChart.setOption({
            title: {
                text: '本息合计图',
                subtext:'在x期还掉剩余贷款花费总额'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['等额本息','等额本金']
            },
            grid: {
                left: '5%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: x_array
            },
            yAxis: {
                type: 'value',
                name:'花费总额/元',
                nameLocation:'middle',
                nameGap:70
            },
            series: [
                {
                    name:'等额本息',
                    type:'line',
                    data:data_list2,
                    smooth: true, 
                    seriesLayoutBy: 'row'
                },
                {
                    name:'等额本金',
                    type:'line',
                    data:data_list1,
                    smooth: true, 
                    seriesLayoutBy: 'row'
                }
            ]
        })
        myChart2.setOption({
            title: {
                text: '每期利息',
                subtext:'每一期产生的利息及每一起所还本金，两者相加即为本息所需还款'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['等额本息本期利息','等额本金本期利息','等额本息本期本金','等额本金本期本金']
            },
            grid: {
                left: '5%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: x_array
            },
            yAxis: {
                type: 'value',
                name:'本期应还利息或本金/元',
                nameLocation:'middle',
                nameGap:50
            },
            series: [
                {
                    name:'等额本息本期利息',
                    type:'line',
                    data:lx_list2,
                    smooth: true, 
                    seriesLayoutBy: 'row'
                },
                {
                    name:'等额本金本期利息',
                    type:'line',
                    data:lx_list1,
                    smooth: true, 
                    seriesLayoutBy: 'row'
                },
                {
                    name:'等额本息本期本金',
                    type:'line',
                    data:bj_list2,
                    smooth: true, 
                    seriesLayoutBy: 'row'
                },
                {
                    name:'等额本金本期本金',
                    type:'line',
                    data:bj_list1,
                    smooth: true, 
                    seriesLayoutBy: 'row'
                }
            ]
        })
    }


    render(){
        const {capital,time,rate,one_obj,two_obj} = this.state
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
                        <Button onClick={this.clear}>重置</Button>
                    </div>
                </div>\
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
                                    <div className="rightValue">{one_obj ? one_obj.count : ''}<span>元</span></div>
                                </li>
                                <li>
                                    <div className="loanLeftTitle">还款月数</div>
                                    <div className="rightValue">{one_obj ? one_obj.time : ''}<span>月</span></div>
                                </li>
                                <li className="one_li">
                                    <div className="loanLeftTitle">每月还款</div>
                                    <div className="rightValue">{one_obj ? one_obj.yhk : ''}<span>元</span></div>
                                </li>
                                <li>
                                    <div className="loanLeftTitle">总支付利息</div>
                                    <div className="rightValue">{one_obj ? one_obj.zlx : ''}<span>元</span></div>
                                </li>
                                <li>
                                    <div className="loanLeftTitle">本息合计</div>
                                    <div className="rightValue">{one_obj ? one_obj.hj : ''}<span>元</span></div>
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
                                    <div className="rightValue">{two_obj ? two_obj.count : ''}<span>元</span></div>
                                </li>
                                <li>
                                    <div className="loanLeftTitle">还款月数</div>
                                    <div className="rightValue">{two_obj ? two_obj.time : ''}<span>月</span></div>
                                </li>
                                <li className="two_li">
                                    <div className="loanLeftTitle">首月还款</div>
                                    <div className="rightValue">{two_obj ? two_obj.yhk : ''}<span>元</span>
                                        <span className="mydj">每月递减{two_obj ? two_obj.ydj : ''}元</span>
                                    </div>
                                </li>
                                <li>
                                    <div className="loanLeftTitle">总支付利息</div>
                                    <div className="rightValue">{two_obj ? two_obj.zlx : ''}<span>元</span></div>
                                </li>
                                <li>
                                    <div className="loanLeftTitle">本息合计</div>
                                    <div className="rightValue">{two_obj ? two_obj.hj : ''}<span>元</span></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="echartBox">
                    <div className="tbHead">
                        {/* <div className="echartTitle">提前还款</div>
                        <div className="tq_box">
                            假设第
                            <InputNumber onChange={(e)=> this.changeCapital(e)} value={300} placeholder="请输入数字" />
                            期全部还完
                        </div> */}
                    </div>
                    <div className="echartBody">
                        <div id="main" style={{ width: 760, height: 500 }}></div>
                        <div id="main2" style={{ width: 760, height: 500 }}></div>
                    </div>
                </div>
                <div className="asses">
                    <div className="asses_name">自我总结：</div>
                    <div className="asses_info">个人见解，不代表任何观点，有任何问题可在<a href="https://zhuanlan.zhihu.com/p/78451797" target="_black">我的知乎</a>上留言或评论</div>
                    <div className="asses_count">
                        由上图可以看出，时间越长，所需还款总额越大，所以最省钱的就是不要贷款，😄😄（这不是废话吗，老子有钱还用贷款吗，好吧，当我没说......），
                    </div>
                    <div className="asses_count">等额本息还款，是每个月还款总额固定，即每月还款本金+利息是一定的，前期主要还款是利息，利息逐渐减少，本金逐渐增加。所以到了一定时间提前还款是不划算的，后期不怎么产生利息了，还的都是本金。</div>
                    <div className="asses_count">等额本金还款，是每个月还款本金一定，每个月所还利息是剩余本金所产生的利息，所以每月所需还利息逐渐减少，每月所需还总额逐渐减少。</div>
                </div>
            </div>
        )
    }
}

export default LoanCounter