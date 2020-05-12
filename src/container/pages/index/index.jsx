import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Footer from '../../components/footer/footer'
import img1 from '../../../static/image/wyyx.png'
import './stylus/index.stylus'
import {getindex} from '../../../http/index'
import {connect} from 'react-redux'
import {getIndexDatas} from '../../../redux/action/index'
import BScroll from 'better-scroll'
import Swiper from 'swiper';    
class Index extends Component {
    state={
        nodeText:[],
        currentIndex:0,
        jiantou:false,
        isMask:false,
        swiperNode:[]
    }
    async componentDidMount(){
        let resulte=await getindex()
        this.props.getindex(resulte)
        this.setState({
            nodeText:this.props.index.kingKongModule.kingKongList,
            swiperNode:resulte.focusList
        })
        this.scrollObj=new BScroll('.headerTagWarp',{scrollX:true,click:true})
        //初始化轮播
         new Swiper ('.swiper-container', {
            direction: 'horizontal', // 垂直切换选项
            loop: true, // 循环模式选项
            
            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
            }
          })        
    }
    changeIndex=(index)=>{
        console.log(index)
        this.setState({
            currentIndex:Number(index)
        })
        setTimeout(() => {
            this.scrollObj.scrollToElement(`.headerTagItem.active`,300)
        }, 0);
        
    }
    changeJianTou=()=>{
        this.setState({
            jiantou:!this.state.jiantou,
            isMask:!this.state.isMask
        })
    }
    watchActive=(index)=>{
        this.setState({
            currentIndex:Number(index)
        })
        setTimeout(() => {
            this.scrollObj.scrollToElement(`.headerTagItem.active`,300)
        }, 0);
    }
    render() {
        // console.log(this.props.location)
        return (
            <div className='index'>
                <div className="indexTop">
                <div className="header">
                    <a href="##"><img src={img1} alt=""/></a>
                    <div className="search" >
                    <div className="fdj">

                    </div>
                    <span>搜索</span>
                    </div>
                    <div className="login"><Link to="/login">登录</Link></div>
                </div>
                <div className="headerTagWarp">
                    <div className='headerTag' >
                        <div className={this.state.currentIndex===0?'headerTagItem active':'headerTagItem'} onClick={()=>{this.changeIndex(0)}}>推荐</div>
                        {this.state.nodeText.map((item,index)=>{
                            return <div className={this.state.currentIndex===(index+1)?'headerTagItem active':'headerTagItem'} key={index} onClick={()=>{this.changeIndex(index+1)}}>{item.text}</div>
                        })}
                    </div>
                    <div className="tagMask">
                        <div className="left">

                        </div>
                        <div className="right">
                            <div className={this.state.jiantou?'jiantou active':'jiantou'}  onClick={this.changeJianTou}></div>
                        </div>
                    </div>
                </div>
                </div>
                <div className="mask" v-if='jiantou'style={{display:(this.state.isMask?"block":"none")}}>
                    <div className="maskTop">
                    全部频道
                    </div>
                    <div className="maskBottom">
                    <div className={this.state.currentIndex===0?'maskBottomItem active':'maskBottomItem'} onClick={()=>{this.watchActive(0)}}>推荐</div>
                    {this.state.nodeText.map((item,index)=>{
                            return <div className={this.state.currentIndex===(index+1)?'maskBottomItem active':'maskBottomItem'} key={index} onClick={()=>{this.watchActive(index+1)}}>{item.text}</div>
                    })}
                    </div>
                </div>          
                <div className="main">
                    <div className="swiper-container">
                        <div className="swiper-wrapper">
                            
                            {
                                this.state.swiperNode.map((item,index)=>{
                                    return <div className="swiper-slide" key={index}><img src={item.picUrl} alt=""/></div>
                                })
                            }
                        </div>
                        
                        <div className="swiper-pagination"></div>
                    </div>
                </div>
                <Footer location='index'/>
            </div>
        )
    }
}
export default connect(
(state)=>{
    return {index:state.index}
},
{
    getindex:getIndexDatas
}
)(Index)