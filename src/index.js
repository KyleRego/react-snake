import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const NUMBER_OF_SQUARES = 10 * 10;

class Game extends React.Component {
  constructor(props) {
    super(props);
    let snakePositions = [this.calculateInitialSnakePosition()];
    let snakeDirection = this.calculateInitialSnakeDirection();
    this.state = {
      snakePositions: snakePositions,
      snakeDirection: snakeDirection,
    }
  }

  componentDidMount() {
    this.intervalId = setInterval(() => this.tick(), 100);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  tick() {
    this.setState((state, props) => ({
      snakePositions: this.calculateNewSnakePositions(state.snakePositions, state.snakeDirection),
      snakeDirection: state.snakeDirection,
    }));
  }

  calculateNewSnakePositions(snakePositions, direction) {
    const head = snakePositions[snakePositions.length - 1];
    let newHead;
    switch (direction) {
      case 'positive-x':
        newHead = [head[0], head[1] + 1];
        break;
      case 'negative-x':
        newHead = [head[0], head[1] - 1];
        break;
      case 'positive-y':
        newHead = [head[0] - 1, head[1]];
        break;
      case 'negative-y':
        newHead = [head[0] + 1, head[1]];
        break;
      default:
        break;
    }
    newHead = this.adjustPositionsToKeepWithinBoundaries(newHead);
    snakePositions.push(newHead);
    snakePositions.shift();
    return snakePositions;
  }

  adjustPositionsToKeepWithinBoundaries(position) {
    const gridLength = Math.sqrt(NUMBER_OF_SQUARES);
    if (position[0] === gridLength) {
      position[0] = 0;
    } else if (position[0] === -1) {
      position[0] = gridLength - 1;
    } else if (position[1] === gridLength) {
      position[1] = 0;
    } else if (position[1] === -1) {
      position[1] = gridLength - 1;
    }
    return position;
  }

  calculateInitialSnakePosition() {
    return [
      Math.floor(Math.random() * Math.sqrt(NUMBER_OF_SQUARES)),
      Math.floor(Math.random() * Math.sqrt(NUMBER_OF_SQUARES))
    ]
  }

  calculateInitialSnakeDirection() {
    const directions = ['positive-x', 'negative-x', 'positive-y', 'negative-y'];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  handleKeyPress(event) {
    console.log('A key was pressed.');
    console.log(event.key);
    switch (event.key) {
      case 'Down':
      case 'ArrowDown':
        this.setState((state, props) => ({
          snakePositions: state.snakePositions,
          snakeDirection: 'negative-y',
        }));
        break;
      case 'Up':
      case 'ArrowUp':
        this.setState((state, props) => ({
          snakePositions: state.snakePositions,
          snakeDirection: 'positive-y',
        }));
        break;
      case 'Left':
      case 'ArrowLeft':
        this.setState((state, props) => ({
          snakePositions: state.snakePositions,
          snakeDirection: 'negative-x',
        }));
        break;
      case 'Right':
      case 'ArrowRight':
        this.setState((state, props) => ({
          snakePositions: state.snakePositions,
          snakeDirection: 'positive-x',
        }));
        break;

      default:
        break;
    }
    console.log(this.state);
  }

  render() {
    return (
      <div className="game"
        onKeyDown={(e) => this.handleKeyPress(e)}
        onClick={() => console.log('It was clicked')}
        tabIndex = "0"
      >
      <Board snakePositions={this.state.snakePositions}/>
      </div>
    )
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    let squares = [];
    for (let i = 0; i < Math.sqrt(NUMBER_OF_SQUARES); i += 1) {
      squares.push(Array(Math.sqrt(NUMBER_OF_SQUARES)).fill(null));
    }
    this.state = {
      squares: squares,
    }
  }

  componentDidMount() {
    console.log(this.state.squares);
  }

  render() {
    return (
      this.state.squares.map((row, rowIndex) => {
        let rowSnakePositions = this.props.snakePositions.filter(snakePosition => {
          return snakePosition[0] === rowIndex;
        }).map(rowSnakePosition => rowSnakePosition[1]);
        
        return (<Row row={row} rowSnakePositions={rowSnakePositions} rowIndex={rowIndex} key={rowIndex}/>)
      })
    )
  }
}

class Row extends React.Component {
  render() {
    return (
      <div className="row">
        {
          this.props.row.map((square, columnIndex) => {
            if (this.props.rowSnakePositions.includes(columnIndex)) {
              square = 'snake'
            }
            return <Square value={square} key={columnIndex}/>;
          })
        }
      </div>
    )
  }
}

class Square extends React.Component {
  render() {
    return (
      <div className={"square " + this.props.value}>
         
      </div>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);