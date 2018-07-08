import React, {Component} from 'react';
import queryString from 'query-string';

class User extends Component {
  constructor(props) {
    super(props);

    const userId = queryString.parse(props.location.search).id;
  }

  render() {
    return (
      <div className='content-wrap'>
        {
          this.userId ?
            <CardpackViewer cardpackId={userId} />
            :
            <div>Must specify a user ID in URL</div>
        }
      </div>
    );
  }
};

export default User;
