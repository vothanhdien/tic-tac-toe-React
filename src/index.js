import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


var MAX = 20;

function Row(props) {
    return(
        <div className="board-row">
            {props.value}
        </div>
    )
}

function Square(props) {
    return (
        <button id={props.id} className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function SortButton(props) {
    return(
        <button className="btn" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class InputBoardSize extends React.Component{
    render(){
        return(
            <div className="inputBoardSize">
                <input type="number" name="size" id="inputSize" className="form-control" min="5" max="20" step="1" required="required" title=""/>
                <button className="btn btn-danger" onClick={()=>this.props.onClick()}>Resize</button>
            </div>
        )
    }
}


class Board extends React.Component {
  renderSquare(i) {
    return <Square
        id={"square" + i}
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
    if(!squares[index])
        return null;
    let winner = null;

    // hang ngang
    let list = [];
    for(let i = row * width; i < row * width + width; i++) {
        list.push({
            id: "square" + i,
            value: squares[i],
        });
    }
    winner = containWin(list,squares[index]);

    if(winner){
        return winner;
    }

    //hang doc
    list=[];

    for(let i = col; i < width * width; i += width){
        list.push({
            id: "square" + i,
            value: squares[i],
        });
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
        list.push({
            id: "square" + i,
            value: squares[i],
        });
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
        list.push({
            id: "square" + i,
            value: squares[i],
        });
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
        if(listArray[i].value === player){
            if(count >= 4) {
                hightLight(listArray,i);
                return player;
            }
            count += 1;
        }else{
            count = 0;
        }
    }
}
function deHightLight() {
    while(document.getElementsByClassName('hightlight').length > 0){
        document.getElementsByClassName('hightlight')[0].classList.remove('hightlight');
    }
}
function hightLight(listArray,i){

    for(let j = i; j >= i - 4 ; j--){
        document.getElementById(listArray[j].id).classList.add('hightlight');
    }
}

function bold(id) {
    if(document.getElementsByClassName('bold').length > 0)
        document.getElementsByClassName('bold')[0].classList.remove('bold');
    if(id!==null)
        document.getElementById(id).classList.add("bold");
}

class Game extends React.Component {
  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, current.row, current.col);
    let  moves;
    if(this.state.isAscending){
        moves = history.map((step, move) => {
            const position = " =====  (row,column): (" + history[move].row + " , " + history[move].col +
                ") ***player: " + history[move].player;
            const desc = move ?
                'Go to move #' + move + position :
                'Go to game start';
            const id = "history" + move;
            return (
                <li key={move}>
                    <button id = {id} className ="btn btn-primary" onClick={() => this.jumpTo(move,id)}>{desc}</button>
                </li>
            );
        });
    }else{
        const newHistory = [].concat(history)
            .reverse();
        const length = newHistory.length;
        moves = newHistory.map((step, move) => {
            const newMove =length - move - 1;
            const position = " =====  (row,column): (" + newHistory[move].row + " , " + newHistory[move].col +
                ") ***player: " + newHistory[move].player;
            const desc = newMove ?
                'Go to move #' + newMove + position :
                'Go to game start';
            const id = "history" + move;
            return (
                <li key={move}>
                    <button id ={id} className ="btn btn-primary" onClick={() => this.jumpTo(newMove,id)}>{desc}</button>
                </li>
            );
        });
    }

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
            <div className="game-info">
              <h1><strong>{ status }</strong></h1>
              <SortButton
                  value={"sort list history"}
                  onClick={()=> this.sortButtonClick()}/>
              <ol className="list_history">{moves}</ol>
            </div>


          </div>
          <hr/>
          <div className="footer">
              <h2>Thay đổi kích thước bàn cờ( từ 5 - 20): </h2>
              <InputBoardSize
                  onClick = {()=> this.resizeButtonClick()}
              />
          </div>
      </div>
    );
  }


  handleClick(i){
      bold(null);
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
  jumpTo(step, id){
    deHightLight();
    bold(id);

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });

  }
  resizeButtonClick(){
      deHightLight();
      let newsize = parseInt(document.getElementById('inputSize').value,10);
      if(newsize && newsize > 4 && newsize < 39){
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
      bold(null);
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
