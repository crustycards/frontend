import React from 'react';
import Cardpack from './Cardpack';

const CardpackList = (props) => (
  <div>
    {props.cardpacks.map((cardpack, index) => (
      <Cardpack
        key={index}
        cardpack={cardpack}
        canDelete={props.canDelete}
      />
    ))}
  </div>
);

export default CardpackList;
