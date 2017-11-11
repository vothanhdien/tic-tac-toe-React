import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


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

function SortButton(props) {
    return(
        <button className="btn" onClick={props.onclick}>
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
        key = {i}
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
    const width = Math.sqrt(squares.length);
    const index = row * width + col;

    let winner = null;

    // hang ngang
    let list = [];
    for(let i = row * width; i < row * width + width; i++) {
        list.push(squares[i]);
    }
    winner = containWin(list,squares[index]);

    if(winner){
        return winner;
    }

    //hang doc
    list=[];

    for(let i = col; i < width * width; i += width){
        list.push(squares[i]);
    }

    winner = containWin(list,squares[index]);
    if(winner)
        return winner;


    let min = col > row ? row: col;
    let max = col > row ? col: row;
    let d = width - max - 1;
    //cheo xuoi
    list =[];

    let minval = (row - min) * width + (col - min);

    let maxval = (row + d) * width + (col + d);

    for(let i = minval ; i <= maxval; i+= width + 1){
        list.push(squares[i]);
    }

    winner = containWin(list,squares[index]);
    if(winner)
        return winner;

    // cheo nguoc
    list = [];
    if(row + col < width){
        minval = col + row;
        maxval = (col + row) * width;
    }else{
        d = width - col - 1;
        let newrow = row - d;
        minval = newrow * width + width - 1;
        maxval = width * (width - 1) + newrow;
    }

    for(let i = minval ; i <= maxval; i += width - 1){
        list.push(squares[i]);
    }
    winner = containWin(list,squares[index]);
    if(winner)
        return winner;
    // khong thang
    return winner;
}
function containWin(listArray, player) {
    if(listArray.length < 5)
        return null;
    let count = 0;
    for(let i  = 0; i < listArray.length;i++){
        if(listArray[i] === player){
            if(count >= 4)
                return player;
            count += 1;
        }else{
            count = 0;
        }
    }
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
              <SortButton
                value={"sort"}
                onClick={()=> this.sortButtonClick()}/>
            <ol>{moves}</ol>
          </div>
      </div>
    );
  }


  handleClick(i){
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();

    const row = (i / MAX)|0;
    const col = i % MAX;

    if(calculateWinner(history[history.length - 1].squares,history[history.length - 1].row,history[history.length - 1].col))
        return;
    if( squares[i]){
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
  sortButtonClick(){
    let x = 0;
    var items = $('.alphaList > li').get();
    items.sort(function(a,b){
      var keyA = $(a).text();
      var keyB = $(b).text();

      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    var ul = $('.alphaList');
    $.each(items, function(i, li){
      ul.append(li); /* This removes li from the old spot and moves it */
    });

    this.setState({
        isAscending: !this.state.isAscending,
    })
  }
  constructor(props){
      super(props);
      this.state ={
          history :[{
              squares: Array(Math.pow(MAX,2)).fill(null),
              row: null,
              col: null,
              player: "unknow",
              winner: null,
          }],
          stepNumber: 0,
          xIsNext: true,
          isAscending: true,
      }
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
