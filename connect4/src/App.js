import React from 'react';
import './App.css';
import InfoBar from './components/InfoBar'
import Board from './components/Board'
import opensocket from 'socket.io-client'


class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      board: Array(6).fill(0).map(x => Array(8).fill('white')),
      socket: opensocket('http://localhost:1337'),
      message: 'Waiting for another player...',
      yourTurn: false
    }
    //let self = this
    this.state.socket.on('board',board => {
      this.setState( {board: board})
    });
    this.state.socket.on('color', color => {
      this.setState({color: color})
    }); 
    this.state.socket.on('turn', player => {
      if(player === this.state.color){
        this.setState(
                      {message: "You're up. What's your move?",
                    yourTurn: true})
      }
      else{
        this.setState(
                      {message: player + ' is thinking...',
                    yourTurn: false})
      }
    });
    this.state.socket.compress('victory', player => {
      let newState = {yourTurn: false}
      if(player === this.state.color){
        newState['message'] = 'You Win!'
      }else{
        newState['message'] = 'You Lose :('
      }
      this.setState(newState)
    });
  }

  onColumnClick = column => this.state.socket.emit('click', column);

  render(){
    return(
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Connect Four Game</h1>
        </header>
        <InfoBar color={this.state.color} message={this.state.message} />
        <Board board={this.state.board} onColumnClick={this.onColumnClick} yourTurn={this.state.yourTurn} />
      </div>
    )
  }
  
  

}

export default App;
