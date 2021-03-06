import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class sizeInput extends React.Component{
//     render(){
//         return <div>
//
//         </div>
//     }
// }
var MAX = 5;
function boardRow(props) {
    return(
        <div className="board-row">
            {props.value}
        </div>
    )
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
class Board extends React.Component {
  renderSquare(i) {
    return <Square
        value = {this.props.squares[i]}
        onClick={() => this.props.onClick(i)} />;
  }
  renderBoardRow(val){
      return <boardRow
          value = {val}
          />
  }

  render() {

    return (
      <div>
          <div className="board-row">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
          </div>
          <div className="board-row">
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
          </div>
          <div className="board-row">
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
          </div>
      </div>
    );
  }
}
//rewrite
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

class Game extends React.Component {
  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const position = " =====  (column,row): (" + history[move].col + " , " + history[move].row +
      ") ***player: " + history[move].player;
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button className ="btn btn-primary" onClick={() => this.jumpTo(move)}>{desc + position}</button>
        </li>
      );
    });

    let status;
    if(winner){
      status = "The winner is " + winner;
    }else{
      status = 'Next player: ' + (this.state.xIsNext? "X" : "O");
    }

    return (
        <div className="contain">
          <div className="game">
            <div className="game-board">
                {/*// board la kieu board ---> chay render()*/}
              <Board
                squares = {current.squares}
                onClick = {(i) => this.handleClick(i)}
              />
            </div>
          </div>
          <hr/>
          <div className="game-info">
              <div><h1><strong>{ status }</strong></h1></div>
            <ol>{moves}</ol>
          </div>
      </div>
    );
  }


  handleClick(i){
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();

    if(calculateWinner(squares) || squares[i]){
        return;
    }
    squares[i] = this.state.xIsNext? "X" : "O";
    this.setState({
        history: history.concat([{ squares: squares,
                                    col: i%3 + 1,
                                    row: (i/3 + 1)|0,
                                    player: this.state.xIsNext? "X":"O",}]),
        stepNumber : history.length,
        xIsNext:!this.state.xIsNext,
    });
  }
  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });

  }

  constructor(props){
      super(props);
      this.state ={
          history :[{
              squares: Array(MAX*MAX).fill(null),
              row: null,
              col: null,
              player: "unknow",
          }],
          stepNumber: 0,
          xIsNext: true,
      }
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
