import * as React from 'react';
import CardpackViewer from '../components/CardpackViewer/index';
import {useGlobalStyles} from '../styles/globalStyles';
import {RouteComponentProps} from 'react-router';

const CardpackPage =
(props: RouteComponentProps<{user: string, cardpack: string}>) => {
  const globalClasses = useGlobalStyles();
  const cardpackName = `users/${props.match.params.user}/cardpacks/${props.match.params.cardpack}`;

  return (
    <div className={globalClasses.contentWrap}>
      <CardpackViewer cardpackName={cardpackName}/>
    </div>
  );
};

export default CardpackPage;
