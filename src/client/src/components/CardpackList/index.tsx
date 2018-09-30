import * as React from 'react';
import Cardpack from './Cardpack';
import { Cardpack as CardpackDao } from '../../api/dao';

interface CardpackListProps {
  cardpacks: Array<CardpackDao>
  canDelete: boolean
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
