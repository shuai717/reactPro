import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import './stylus/footer.css'
export default class Footer extends Component {
    state={
        flag:''
    }
    componentDidMount(){
        // console.log(this.props.location)
        switch (this.props.location) {
            case 'index':
                    this.setState({
                        flag:'index'
                    })
                break;
             case 'buy':
                    this.setState({
                        flag:'buy'
                    })
                break;
             case 'category':
                    this.setState({
                        flag:'category'
                    })
                break;
            case 'personal':
                    this.setState({
                        flag:'personal'
                    })
                break;
            case 'shopCar':
                    this.setState({
                        flag:'shopCar'
                    })
                break;
            default:
                break;
        }
    }
    render() {
        
        return (
                <div className="footer">
                    <div >
                        <Link to='/index' className={'one '+(this.props.location==='index'?this.state.flag:"")}>
                            <div className="top1"></div>
                            首页
                        </Link>
                    </div>
                    <div >
                        <Link to='/category' className={'one '+(this.props.location==='category'?this.state.flag:"")}>
                        <div className="top2"></div>
                            分类
                        </Link>
                    </div>
                    <div >
                        <Link to='/buy' className={'one '+(this.props.location==='buy'?this.state.flag:"")}>
                            <div className="top3"></div>
                            值得买
                        </Link>
                    </div>
                    <div >
                        <Link to='/shopcar' className={'one '+(this.props.location==='shopCar'?this.state.flag:"")}>
                            <div className="top4"></div>
                            购物车
                        </Link>
                    </div>
                    <div >
                        <Link to='/personal' className={'one '+(this.props.location==='personal'?this.state.flag:"")}> 
                            <div className="top5"></div>
                            个人
                        </Link>
                    </div>
                </div>
        )
    }
}
