import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {TextField, Paper, MenuItem, withStyles} from '@material-ui/core';
import _ from 'underscore';


const styles = (theme) => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    height: 250
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  }
});

const renderInput = (inputProps) => {
  const {classes, ref, ...other} = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: ref,
        classes: {
          input: classes.input
        },
        ...other
      }}
    />
  );
};

const renderSuggestion = (suggestion, {query, isHighlighted}) => {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{fontWeight: 500}}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{fontWeight: 300}}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
};

const renderSuggestionsContainer = ({containerProps, children}) => (
  <Paper {...containerProps} square>
    {children}
  </Paper>
);

const getSuggestionValue = ({label}) => (label);

class AutoComplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: []
    };

    this.submit = _.throttle(this.props.onSubmit, 100, {trailing: false});

    this.handleSuggestionsFetchRequested = this.handleSuggestionsFetchRequested.bind(this);
    this.handleSuggestionsClearRequested = this.handleSuggestionsClearRequested.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  async handleSuggestionsFetchRequested({value}) {
    const suggestions = (await this.props.getSuggestions(value)).map((label) => ({label}));
    this.setState({suggestions});
  }

  handleSuggestionsClearRequested() {
    this.setState({suggestions: []});
  }

  handleChange(event, {newValue}) {
    this.setState({value: newValue});
  }

  handleKeyDown(event) {
    if (event.key === 'Enter' && this.state.value) {
      this.submit(this.state.value);
    }
  }

  render() {
    const {classes} = this.props;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionSelected={(e, {suggestionValue}) => this.submit(suggestionValue)}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          classes,
          placeholder: this.props.label || '',
          value: this.state.value,
          onChange: this.handleChange,
          onKeyDown: this.handleKeyDown
        }}
      />
    );
  }
}

export default withStyles(styles)(AutoComplete);
