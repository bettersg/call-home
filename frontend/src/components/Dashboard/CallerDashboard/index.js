import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import CalleeTable from './CalleeTable';
import CallDialog from './CallDialog';
import { useUserService } from '../../../contexts';

function CallerDashboard() {
  const [userState] = useUserService();
  const { me: userInfo } = userState;

  const [activeCall, setActiveCall] = useState(null);
  const onCallClick = (callee) => {
    setActiveCall({
      userEmail: userInfo.email,
      calleeId: callee.id,
      calleeName: callee.name,
    });
  };
  return (
    <>
      <CalleeTable onCallClick={onCallClick} />
      <CallDialog
        call={activeCall}
        open={Boolean(activeCall)}
        disconnectCall={() => setActiveCall(null)}
      />
    </>
  );
}

export default CallerDashboard;
