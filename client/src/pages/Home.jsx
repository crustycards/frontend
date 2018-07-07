import React from 'react';
import FriendsList from '../components/FriendsList.jsx';
import FriendRequestsSent from '../components/FriendRequestsSent.jsx';
import FriendRequestsReceived from '../components/FriendRequestsReceived.jsx';
import FrienderPanel from '../components/FrienderPanel.jsx';

const Home = (props) => (
  <div className='content-wrap'>
    <div className='col-narrow'>
      <FrienderPanel />
      <FriendsList />
      <FriendRequestsSent />
      <FriendRequestsReceived />
    </div>
    <div className='col-wide'>
    </div>
  </div>
);

export default Home;
