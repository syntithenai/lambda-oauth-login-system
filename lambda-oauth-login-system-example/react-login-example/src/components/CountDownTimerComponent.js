import React from 'react';
import {useState, useEffect} from 'react';
import {Button, } from 'react-bootstrap'
import DropDownSelectorComponent from './DropDownSelectorComponent'

const stopwatchIcon = 
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stopwatch" viewBox="0 0 16 16">
  <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5V5.6z"/>
  <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64a.715.715 0 0 1 .012-.013l.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354a.512.512 0 0 1-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5zM8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3z"/>
</svg>

const pauseIcon = 
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">
  <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
</svg>

const stopIcon = 
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stop-fill" viewBox="0 0 16 16">
  <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>
</svg>

const playIcon = 
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
</svg>

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
