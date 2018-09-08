import React from 'react';
import CardpackViewer from '../components/CardpackViewer/index.tsx';
import queryString from 'query-string';

const Cardpack = (props) => (
  <div className='content-wrap'>
    {
      queryString.parse(props.location.search).id &&
        <CardpackViewer cardpackId={queryString.parse(props.location.search).id} />
    }
  </div>
);

export default Cardpack;
