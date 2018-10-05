import {
  Button,
  Checkbox,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField
} from '@material-ui/core';
import * as React from 'react';
import {Component} from 'react';
import {ApiContextWrapper} from '../../api/context';
import {Cardpack} from '../../api/dao';
import Api from '../../api/model/api';

interface GameCreatorProps {
  api: Api;
}

interface GameCreatorState {
  gameName: string;
  maxPlayers: number;
  maxScore: number;
  handSize: number;
  userCardpacks: Cardpack[];
  subscribedCardpacks: Cardpack[];
  cardpacksSelected: string[];
  isLoading: boolean;
}

class GameCreator extends Component<GameCreatorProps, GameCreatorState> {

  private static generateNumberedMenuItems(startNum: number, endNum: number): JSX.Element[] {
    const items = [];
    for (let i = startNum; i <= endNum; i++) {
      items.push(<MenuItem value={i} key={i}>{i}</MenuItem>);
    }
    return items;
  }
  constructor(props: GameCreatorProps) {
    super(props);
    this.state = {
      gameName: '',
      maxPlayers: 8,
      maxScore: 8,
      handSize: 6,
      userCardpacks: [],
      subscribedCardpacks: [],
      cardpacksSelected: [],
      isLoading: true
    };

    this.loadCardpacks = this.loadCardpacks.bind(this);
    this.handleGameNameChange = this.handleGameNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  public componentDidMount() {
    this.loadCardpacks();
  }

  public render() {
    return (
      <div>
        <h2>Create Game</h2>
        <div className='content-wrap' style={{overflow: 'auto'}}>
          <div className='col-narrow center'>
            <TextField
              name='gameName'
              label='Game Name'
              value={this.state.gameName}
              onChange={this.handleGameNameChange}
            />
            <br/>
            <span>Max Players: </span>
            <Select
              value={this.state.maxPlayers}
              onChange={(e) => this.setState({maxPlayers: parseInt(e.target.value, 10)})}
            >
              {GameCreator.generateNumberedMenuItems(4, 20)}
            </Select>
            <br/>
            <span>Winning Score: </span>
            <Select
              value={this.state.maxScore}
              onChange={(e) => this.setState({maxScore: parseInt(e.target.value, 10)})}
            >
              {GameCreator.generateNumberedMenuItems(4, 20)}
            </Select>
            <br/>
            <span>Hand Size: </span>
            <Select
              value={this.state.handSize}
              onChange={(e) => this.setState({handSize: parseInt(e.target.value, 10)})}
            >
              {GameCreator.generateNumberedMenuItems(3, 20)}
            </Select>
          </div>
          <div className='col-wide'>
            <div className='subpanel'>
              {this.state.isLoading ?
                <div style={{textAlign: 'center'}}>
                  <h3>Loading Cardpacks...</h3>
                  <CircularProgress/>
                </div>
                :
                <div>
                  {/* TODO - Keep code dry by refactoring the two <List/> uses below into separate component */}
                  <h3>Your Cardpacks</h3>
                  <List>
                    {this.state.userCardpacks.map((c) => (
                      <ListItem
                        key={c.id}
                      >
                        <Checkbox
                          checked={this.state.cardpacksSelected.includes(c.id)}
                          onChange={this.handleSelectChange.bind(this, c.id)}
                        />
                        <ListItemText primary={c.name} />
                      </ListItem>
                    ))}
                  </List>
                  <h3>Subscribed Cardpacks</h3>
                  <List>
                    {this.state.subscribedCardpacks.map((c) => (
                      <ListItem
                        key={c.id}
                      >
                        <Checkbox
                          checked={this.state.cardpacksSelected.includes(c.id)}
                          onChange={this.handleSelectChange.bind(this, c.id)}
                        />
                        <ListItemText primary={c.name} />
                      </ListItem>
                    ))}
                  </List>
                </div>
              }
            </div>
          </div>
        </div>
        <div className='center'>
          <Button type='submit' onClick={this.handleSubmit}>Submit</Button>
        </div>
      </div>
    );
  }

  private loadCardpacks() {
    Promise.all([this.props.api.main.getCardpacksByUser(), this.props.api.main.getFavoritedCardpacks()])
      .then(([userCardpacks, subscribedCardpacks]) => {
        this.setState({userCardpacks, subscribedCardpacks, isLoading: false});
      });
  }

  private handleGameNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({gameName: e.target.value});
  }

  private handleSelectChange(id: string) {
    if (this.state.cardpacksSelected.includes(id)) {
      this.setState({cardpacksSelected: this.state.cardpacksSelected.filter((cId) => cId !== id)});
    } else {
      this.setState({cardpacksSelected: [...this.state.cardpacksSelected, id]});
    }
  }

  private handleSubmit() {
    this.props.api.game.createGame(
      this.state.gameName,
      this.state.maxPlayers,
      this.state.maxScore,
      this.state.handSize,
      this.state.cardpacksSelected
    );
  }
}

export default ApiContextWrapper(GameCreator);
