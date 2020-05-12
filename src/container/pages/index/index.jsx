import React, { Component } from 'react'
import Footer from '../../components/footer/footer'
export default class Index extends Component {
    render() {
        // console.log(this.props.location)
        return (
            <div>
                index
                <Footer location='index'/>
            </div>
        )
    }
}
