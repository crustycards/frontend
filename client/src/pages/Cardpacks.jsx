import React from 'react';
import CardpackViewer from '../components/CardpackViewer/index.jsx';
import CardpackManager from '../components/CardpackManager/index.jsx';
import queryString from 'query-string';

const Cardpack = (props) => (
  <div className='content-wrap'>
    {queryString.parse(props.location.search).id ? <CardpackViewer cardpackId={queryString.parse(props.location.search).id} /> : <CardpackManager/>}
  </div>
);

export default Cardpack;
