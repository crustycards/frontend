import * as React from 'react';
import {Cardpack as CardpackDao} from '../../api/dao';
import Cardpack from './Cardpack';

interface CardpackListProps {
  cardpacks: CardpackDao[];
  onDelete?(cardpackId: string): void;
}

const CardpackList = (props: CardpackListProps) => (
  <div>
    {props.cardpacks.map((cardpack, index) => (
      <Cardpack
        key={index}
        cardpack={cardpack}
        onDelete={props.onDelete}
      />
    ))}
  </div>
);

export default CardpackList;
