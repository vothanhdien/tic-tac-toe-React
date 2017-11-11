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

function Row(props) {
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

class InputBoardSize extends React.Component{
    render(){
        return(
            <div className="inputBoardSize">
                <input type="number" name="size" id="inputSize" className="form-control" min="5" step="1" required="required" title=""/>
                <button className="btn btn-danger" onClick={()=>this.props.onClick()}>Resize</button>
            </div>
        )
    }
}


class Board extends React.Component {
  renderSquare(i) {
    return <Square
        value = {this.props.squares[i]}
        onClick={() => this.props.onClick(i)}/>;
  }
  renderRow(listSquares){
      return <Row
          value = {listSquares}
          />
  }

  render() {
    let listRow = [];
    let width = Math.sqrt(this.props.squares.length);
    for(let i = 0; i< width; i++){
        let listSquare = [];
        for(let j = 0; j < width; j++){
            listSquare.push(this.renderSquare(i*width + j));
        }
        listRow.push(this.renderRow(listSquare));
    }
    return (
      <div>
          {listRow}
      </div>
    );
  }
}
//rewrite
function calculateWinner(squares, row, col) {
    const width = squares.length
    let listHorizon
    // for (let i = 0; i < lines.length; i++) {
    //     const [a, b, c] = lines[i];
    //     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    //         return squares[a];
    //     }
    // }
    return null;
}

class Game extends React.Component {
  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, current.row, current.col);

    const moves = history.map((step, move) => {
      const position = " =====  (row,column): (" + history[move].row + " , " + history[move].col +
      ") ***player: " + history[move].player;
      const desc = move ?
        'Go to move #' + move + position :
        'Go to game start';
      return (
        <li key={move}>
          <button className ="btn btn-primary" onClick={() => this.jumpTo(move)}>{desc}</button>
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
              <InputBoardSize
                  onClick = {()=> this.resizeButtonClick()}
              />
              <hr/>
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

    const width = current.length;
    const row = (i/width + 1)|0;
    const col = i%MAX + 1;
    if( squares[i] || calculateWinner(squares, row, col)){
        return;
    }
    squares[i] = this.state.xIsNext? "X" : "O";
    this.setState({
        history: history.concat([{ squares: squares,
                                    col: col,
                                    row: row,
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
  resizeButtonClick(){
      let newsize = parseInt(document.getElementById('inputSize').value,10);
      if(newsize && newsize > 4){
        alert(newsize);
        MAX = newsize;
        this.setState({
            history :[{
                squares: Array(Math.pow(MAX,2)).fill(null),
                row: null,
                col: null,
                player: "unknow",
            }],
            stepNumber: 0,
            xIsNext: true
        })
      }else
          alert("vui long nhap lai size");
  }
  constructor(props){
      super(props);
      this.state ={
          history :[{
              squares: Array(Math.pow(MAX,2)).fill(null),
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
