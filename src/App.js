import logo from './logo.svg';
import './App.css';
import React from 'react';

// number of rows and cols in the game
const rows = 20
const cols = 20
// the grid for the game
const grid = []
// the neighbouring indexes for each cell
const rules = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]

const check_cell = (board, i, j) => {
  /*
  function to check whether a cell on a board will live or die
  params: board - the board, i - the row number, j - the column number
  output: boolean representing whether the cell lives or dies
  */
  let num_neighbours = 0
  rules.forEach(e => {
    let k = i + e[0]
    let s = j + e[1]
    if (s >= 0 && s < cols && k >= 0 && k < rows){
      if (board[k][s]==1) num_neighbours++;
    }
  })
  return (board[i][j]==1 && (num_neighbours==2 || num_neighbours==3)) || (num_neighbours==3);
}

// filling out the board
for (let i=0; i<rows; i++){
  const c = []
  for (let j=0; j<cols; j++){
    c.push(0)
  }
  grid.push(c)
}

// representing the cell as a square element
function Square(props) {
  return <div className='Square' 
  style={{
    width: 20,
    height: 20,
    backgroundColor: props.val==1 ? 'black' : 'white',
    border: "solid 1px black" 
  }}
  onClick={() => {props.onClick()}}></div>
}

// function to timeout and return a promise so that the simulation can run
function wait() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 100);
  });
}

// main game class
class Game extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      grid: grid,
      start: true,
    }
  }
  // function for running the simulation
  async run() {
    console.log(this.state.start)
    await wait()
    const new_grid = this.state.grid.slice()
    for (let i=0; i<rows; i++){
      for (let j=0; j<cols; j++){
        new_grid[i][j] = check_cell(new_grid, i, j) ? 1:0;
      }
    }
    // terminal condition happens when the edit button is clicked
    if (this.state.start==true) return
    // updating the grid
    this.setState({
      grid: new_grid,
      start: this.state.start,
    })
    this.run()
  }
  render() {
    return (
      <>
      <button className='button' onClick={()=>{
        if (!this.state.start){
          this.setState({
            grid: grid,
            start: !this.state.start,
          })
        }
        else {
          this.setState({
            grid: grid,
            start: !this.state.start,
          })
          this.run()
        }
      }}>{this.state.start ? "Simulate" : "Edit"}</button>
      <div className='Grid' style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 20px)`
      }}>
        {this.state.grid.map((row, i) => (
          row.map((col, j) => (
            <Square key={`${i}-${j}`}
            onClick={()=>{
              if (this.state.start){
                const new_grid = this.state.grid.slice()
                new_grid[i][j] = new_grid[i][j]==1 ? 0:1;
                this.setState({
                  grid: new_grid,
                  start: this.state.start,
                })
              }
            }}
            val={this.state.grid[i][j]}
            />
          ))
        ))}
      </div>
      </>
    )
  }
}

function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
