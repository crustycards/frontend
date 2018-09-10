import * as React from 'react';
import CardpackViewer from '../components/CardpackViewer/index';
import * as queryString from 'query-string';
import {Location} from 'history';

const Cardpack = (props: {location: Location}) => (
  <div className='content-wrap'>
    {
      queryString.parse(props.location.search).id &&
        <CardpackViewer cardpackId={queryString.parse(props.location.search).id} />
    }
  </div>
);

export default Cardpack;
