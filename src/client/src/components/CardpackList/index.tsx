import * as React from 'react';
import { Cardpack as CardpackDao } from '../../api/dao';
import Cardpack from './Cardpack';

interface CardpackListProps {
  cardpacks: CardpackDao[];
  canDelete: boolean;
}

const CardpackList = (props: CardpackListProps) => (
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
