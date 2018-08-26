import * as React from 'react';
import {Component} from 'react';
import {
  withStyles,
  CircularProgress,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Theme,
  Card,
  List,
  ListItem
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {ApiContextWrapper} from '../api/context';
import { Session } from '../api/dao';
import * as _ from 'underscore';
import Api from '../api/model/api';

const styles = (theme: Theme) => ({
  root: {
    maxWidth: '600px'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  details: {
    display: 'block'
  },
  card: {
    padding: '10px'
  }
});

interface SessionManagerProps {
  classes: any
  api: Api
}

interface SessionManagerState {
  isLoading: boolean
  sessions: Session[]
}

class SessionManager extends Component<SessionManagerProps, SessionManagerState> {
  constructor(props: SessionManagerProps) {
    super(props);

    this.state = {
      isLoading: false,
      sessions: []
    };

    this.loadSessions = this.loadSessions.bind(this);
    this.firstLoad = _.once(this.loadSessions);
  }

  async loadSessions() {
    await new Promise((resolve) => this.setState({isLoading: true}, () => resolve()));
    const sessions = await this.props.api.auth.getUserSessions();
    await new Promise((resolve) => this.setState({sessions, isLoading: false}, () => resolve()));
  }

  firstLoad() {}

  render() {
    return (
      <div className={this.props.classes.root}>
        <ExpansionPanel onChange={this.firstLoad}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={this.props.classes.heading}>Sessions</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={this.props.classes.details}>
            {this.state.isLoading ?
              <CircularProgress style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}}/>
              :
              <List>
                {
                  this.state.sessions.map((session, index) => (
                    <ListItem><Card key={index} className={this.props.classes.card}>{session.id}</Card></ListItem>
                  ))
                }
              </List>
            }
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default ApiContextWrapper(withStyles(styles)(SessionManager));
