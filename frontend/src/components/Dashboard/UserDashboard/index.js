import React, { useState } from 'react';

import { useUserService } from '../../../contexts';
import Button from '@material-ui/core/Button';
import CallDialog from '../CallerDashboard/CallDialog';

function UserDashboard() {
  const [userState] = useUserService();
  const { me: userInfo } = userState;

  const [activeCall, setActiveCall] = useState(null);
  const onCallClick = () => {
    setActiveCall({
      userEmail: 'singjie@singjie.com',
      phoneNumber: '+6597515885',
      calleeName: 'leesingjie',
    });
  };
  return (
    <>
      <div>User : {userInfo.email}</div>
      <Button onClick={() => onCallClick()}>Click to Call</Button>
      <CallDialog
        call={activeCall}
        open={Boolean(activeCall)}
        disconnectCall={() => setActiveCall(null)}
      />
    </>
  );
}

export default UserDashboard;
