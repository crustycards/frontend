import {Location} from 'history';
import * as queryString from 'query-string';
import * as React from 'react';
import CardpackViewer from '../components/CardpackViewer/index';

const Cardpack = (props: {location: Location}) => (
  <div className='content-wrap'>
    {
      queryString.parse(props.location.search).id &&
        <CardpackViewer cardpackId={queryString.parse(props.location.search).id as string} />
    }
  </div>
);

export default Cardpack;
