import React from 'react';
import CardpackViewer from '../components/CardpackViewer/index.jsx';
import queryString from 'query-string';

const Cardpack = (props) => (
  <div className='content-wrap'>
    <CardpackViewer cardpackId={queryString.parse(props.location.search).id || null} />
  </div>
);

export default Cardpack;