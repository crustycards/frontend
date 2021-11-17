import * as React from 'react';
import {TextField} from '@mui/material';

interface NumberBoundTextFieldProps {
  style?: React.CSSProperties;
  label: string;
  value: number;
  minValue: number;
  maxValue: number;
  onChange: (num: number) => void;
  disabled?: boolean;
}

const NumberBoundTextField = (props: NumberBoundTextFieldProps) => {
  return <TextField
    style={props.style}
    label={props.label}
    value={props.value}
    InputProps={{inputProps: {min: props.minValue, max: props.maxValue}}}
    type={'number'}
    onChange={(e) => {
      // Converting from string to number here is safe
      // because of the `type={'number'}` prop above.
      // TODO - Find a way to do this type conversion
      // without needing 'as unknown' here. Maybe
      // just use parseInt() instead.
      props.onChange(e.target.value as unknown as number);
    }}
    disabled={props.disabled}
    onBlur={() => {
      if (props.value > props.maxValue) {
        props.onChange(props.maxValue);
      } else if (props.value < props.minValue) {
        props.onChange(props.minValue);
      }
    }}
  />;
};

export default NumberBoundTextField;