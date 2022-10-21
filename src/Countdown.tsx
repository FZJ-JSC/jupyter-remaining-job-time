import {ReactWidget} from '@jupyterlab/apputils'

import React from 'react';

const padNumber = (num: number) => String(num).padStart(2, '0')

class Countdown extends React.Component<any, any> {
  private readonly date: number;
  constructor(props: any) {
    super(props);
    this.date = Date.parse(props.date);
    this.state = {
      remaining_seconds: Math.max(0, (this.date - Date.now()) / 1000),
    };
  }

  componentDidMount() {
    setInterval(this.setRemainingTime, 1000);
  }

  setRemainingTime = () => {
    this.setState({
        remaining_seconds: Math.max(0, (this.date - Date.now()) / 1000)
    })
  }


  render() {
    return <span className={this.state.remaining_seconds < 300 ? "jp-remaining-job-time-low-time" : ""}>
      Remaining job time: {this.remainingTime(this.state.remaining_seconds)}
    </span>
  }

  remainingTime(remaining: number): string {
    const remainingSeconds = Math.floor(remaining % 60);
    remaining /= 60;
    const remainingMinutes = Math.floor(remaining % 60);
    remaining /= 60;
    const remainingHours = Math.floor(remaining);
    return `${padNumber(remainingHours)}:${padNumber(remainingMinutes)}:${padNumber(remainingSeconds)}`;
  }
}

export const createCountdown = (date: string): ReactWidget => {
  return ReactWidget.create(<Countdown date={date}/>)
}
