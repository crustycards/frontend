import * as React from 'react';
import {Component} from 'react';
import * as Autosuggest from 'react-autosuggest';
import parseHighlights from '../helpers/autoComplete';
import {TextField, Paper, MenuItem, withStyles, Theme, WithStyles} from '@material-ui/core';
import * as _ from 'underscore';

const styles = (theme: Theme) => ({
  container: {
    flexGrow: 1,
    height: 250
  },
  suggestionsContainerOpen: {
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

const renderInput: Autosuggest.RenderInputComponent<string> = (inputProps: any) => {
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

const renderSuggestion: Autosuggest.RenderSuggestion<any> = (suggestion, {query, isHighlighted}) => {
  const parts = parseHighlights(suggestion.label, query);
  console.log(suggestion.label, query, parts);

  return (
    <MenuItem selected={isHighlighted} component={'div'}>
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{fontWeight: 700}}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{fontWeight: 400}}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
};

const renderSuggestionsContainer: Autosuggest.RenderSuggestionsContainer = ({containerProps, children}) => (
  <Paper {...containerProps} square>
    {children}
  </Paper>
);

interface AutoCompleteSuggestion {
  label: string
}

interface AutoCompleteProps extends WithStyles<typeof styles> {
  label?: string
  onSubmit(query: string): void
  getSuggestions(text: string): Promise<Array<string>>
}

interface AutoCompleteState {
  value: string
  suggestions: AutoCompleteSuggestion[]
  submit(query: string): void
}

class AutoComplete extends Component<AutoCompleteProps, AutoCompleteState> {
  constructor(props: AutoCompleteProps) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
      submit: _.throttle(this.props.onSubmit, 100, {trailing: false})
    };

    this.handleSuggestionsFetchRequested = this.handleSuggestionsFetchRequested.bind(this);
    this.handleSuggestionsClearRequested = this.handleSuggestionsClearRequested.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  async handleSuggestionsFetchRequested({value}: Autosuggest.SuggestionsFetchRequestedParams) {
    const suggestions = (await this.props.getSuggestions(value)).map((label) => ({label}));
    this.setState({suggestions});
  }

  handleSuggestionsClearRequested() {
    this.setState({suggestions: []});
  }

  handleChange(event: React.FormEvent<any>, {newValue}: Autosuggest.ChangeEvent) {
    this.setState({value: newValue});
  }

  handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter' && this.state.value) {
      this.state.submit(this.state.value);
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
        onSuggestionSelected={(e, {suggestionValue}) => this.state.submit(suggestionValue)}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={({label}) => (label)}
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