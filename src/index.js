import React from 'react'
import ReactDOM from 'react-dom/client';
import './index.css';

const Break = (props) => {
  return (
    <div>
      <h2 id="break-label" className="label">
        Break Length
      </h2>

      <div className="container1">
        {" "}
        <button
          className="btn btn-primary control"
          onClick={props.decrement}
          id="break-decrement"
        >
          -{" "}
        </button>
        <h3 id="break-length" className="val">
          {props.bl}
        </h3>
        <button
          className="btn btn-primary control"
          onClick={props.increment}
          id="break-increment"
        >
          +{" "}
        </button>
      </div>

      <h2 id="session-label" className="label">
        Session Length
      </h2>
      <div className="container1">
        <button
          className="btn btn-primary control"
          onClick={props.decrement}
          id="session-decrement"
        >
          -{" "}
        </button>

        <h3 id="session-length" className="val">
          {props.sl}
        </h3>
        <button
          className="btn btn-primary control"
          onClick={props.increment}
          id="session-increment"
        >
          +{" "}
        </button>
      </div>
    </div>
  );
};

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerType: "Session",
      time: {},
      timer: 1500,
      seconds: 1500,
    };
    this.timer = 0;
    this.pause = 1;
    this.handleReset = this.handleReset.bind(this);
    this.handleDec = this.handleDec.bind(this);
    this.handleInc = this.handleInc.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.beep = this.beep.bind(this);
    this.clock = this.clock.bind(this);
    this.toggleState = this.toggleState.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  changeState() {
    this.toggleState(this.state);
    
    if (this.state.timerType === "Session") {
      console.log("ok");
      this.setState({
        seconds: this.state.sessionLength * 60,
        time: { m: this.state.sessionLength, s: 0 + "0" },
      });
      this.pause = 1;
      this.startTimer();
    }

    if (this.state.timerType === "Break") {
      this.setState({
        seconds: this.state.breakLength * 60,
        time: { m: this.state.breakLength, s: 0 + "0" },
      });
      this.pause = 1;
      this.startTimer();
    }
  }

  clock() {
    if (this.state.seconds < 0) return "00:00";
    let minutes = Math.floor(this.state.seconds / 60);
    let seconds = this.state.seconds - minutes * 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return minutes + ":" + seconds;
  }

  toggleState(sh) {
    if (sh.timerType === "Session") {
      this.setState({
        timerType: "Break",
      });
    }
    if (sh.timerType === "Break") {
      this.setState({
        timerType: "Session",
      });
    }
  }

  handleReset() {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      seconds: 1500,
      time: { m: 25, s: 0 + "0" },
      timerType: "Session",
    });
    clearInterval(this.timer);
    this.timer = 0;
    this.pause = 1;
    document.getElementById("time-left").style.color = "#102027";
    this.beep(1);
  }

  handleDec(e) {
    if (e.target.id === "break-decrement" && this.state.breakLength > 1) {
      this.setState({
        breakLength: this.state.breakLength - 1,
      });
    }
    if (e.target.id === "session-decrement" && this.state.sessionLength > 1) {
      this.setState({
        sessionLength: this.state.sessionLength - 1,
        time: { m: this.state.sessionLength - 1, s: 0 + "0" },
        seconds: (this.state.sessionLength - 1) * 60,
      });
    }
  }

  handleInc(e) {
    if (
      (e.target.id === "bi" || e.target.id === "break-increment") &&
      this.state.breakLength < 60
    ) {
      this.setState({
        breakLength: this.state.breakLength + 1,
      });
    }

    if (
      (e.target.id === "si" || e.target.id === "session-increment") &&
      this.state.sessionLength < 60
    ) {
      this.setState({
        sessionLength: this.state.sessionLength + 1,
        time: { m: this.state.sessionLength + 1, s: 0 + "0" },
        seconds: (this.state.sessionLength + 1) * 60,
      });
    }
  }

  secondsToTime(secs) {
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    let obj = {
      m: minutes,
      s: seconds,
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  startTimer(e) {
    this.pause = this.pause + 1;

    if (this.timer === 0 && this.state.seconds > 0 && this.pause % 2 === 0) {
      this.timer = () => {
        setTimeout(this.timer, 1000);
        this.countDown();
      };
      setTimeout(this.timer, 1000);
    }
    console.log(this.pause % 2 === 0);
  }

  beep(state) {
    const sound = document.getElementById("beep");
    if (state === 0) {
      sound.play();
    }

    if (state === 1) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  countDown() {
    let seconds;
    if (this.pause % 2 === 0) {
      seconds = this.state.seconds - 1;
      this.setState({
        time: this.secondsToTime(seconds),
        seconds: seconds,
      });
    }
    if (seconds < 60) {
      document.getElementById("time-left").style.color = "#9c2525";
    }
    if (seconds === 0) {
      this.beep(0);

     const myTimeout = setTimeout(this.changeState, 1000);
    }
  }

  render() {
    return (
      <div>
        <Break
          bl={this.state.breakLength}
          sl={this.state.sessionLength}
          decrement={this.handleDec}
          increment={this.handleInc}
        />
        <div id="timer">
          <h1 id="timer-label">{this.state.timerType}</h1>
          <h2 id="time-left">{this.clock()}</h2>
          <button
            id="start_stop"
            className="btn btn-primary timer-control"
            onClick={this.startTimer}
          >
            Start/Stop
          </button>
          <button
            id="reset"
            className="btn btn-primary timer-control"
            onClick={this.handleReset}
          >
            Reset
          </button>
        </div>
        <audio
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          className="clip"
          id="beep"
        ></audio>
      </div>
    );
  }
}
const root = ReactDOM.hydrateRoot(document.getElementById("root"))
root.render(<Clock />);
