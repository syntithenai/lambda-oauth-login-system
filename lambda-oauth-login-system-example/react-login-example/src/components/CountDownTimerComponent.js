import React from 'react';
import {useState, useEffect} from 'react';
import {Button, } from 'react-bootstrap'
import DropDownSelectorComponent from '../form_field_components/DropDownSelectorComponent'


import icons from '../icons'
const {stopwatchIcon, pauseIcon, stopIcon, playIcon} = icons

var button = <span>{stopwatchIcon}</span>

export default class CountDownTimerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {timerDuration: 0, date: new Date(), startTime: 0, secondsRemaining: 0, timerActive: false};
	this.startTimer =this.startTimer.bind(this)
	this.stopTimer =this.stopTimer.bind(this)
	this.pauseTimer =this.pauseTimer.bind(this)
	this.unpauseTimer =this.unpauseTimer.bind(this)
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
	  if (this.state.timerActive) { 
			var remaining = this.state.secondsRemaining - 1
			if (remaining >= 0) {
				this.setState({secondsRemaining: remaining})
			} else {
				var start = this.state.startTime
				this.stopTimer()
				if (this.props.onFinishTimer) {
					this.props.onFinishTimer(start)
				} 
			}
		}
   }
  
  	startTimer(duration) {
		console.log(['start TIMER',this.state.timerActive,this.state.secondsRemaining, this.state.startTime])
		this.setState({timerDuration: duration, startTime: new Date().getTime()/1000, secondsRemaining: duration, timerActive: true})
	}
	
	stopTimer() {
		console.log(['stop TIMER',this.state.timerActive,this.state.secondsRemaining, this.state.startTime])
		this.setState({timerDuration: 0, startTime: null, secondsRemaining: 0, timerActive: false})
		
	}

	pauseTimer() {
		console.log(['pause TIMER',this.state.timerActive,this.state.secondsRemaining, this.state.startTime])
		this.setState({timerActive: false})
	}
	
	unpauseTimer() {
		console.log(['unpoause TIMER',this.state.timerActive,this.state.secondsRemaining, this.state.startTime])
		this.setState({timerActive: true})
	}
	
	render() {
		return (
		  <span>
			{(!this.state.secondsRemaining || this.state.secondsRemaining <= 0) && <><DropDownSelectorComponent  variant="primary"  buttonContent={button} options={[2,5, 60,120,300,30]} onChange={this.startTimer} /></>}
			{(this.state.secondsRemaining > 0) && <>
				<Button variant="primary" >{this.state.secondsRemaining}</Button>
				<Button variant="danger" onClick={this.stopTimer} >{stopIcon}</Button>
				{this.state.timerActive && <Button onClick={this.pauseTimer} variant="warning">{pauseIcon}</Button>}
				{!this.state.timerActive && <Button onClick={this.unpauseTimer} variant="success">{playIcon}</Button>}
			</>}
		</span>
		);
	}
}
