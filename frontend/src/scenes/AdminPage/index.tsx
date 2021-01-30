import React, { useCallback, useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { SceneProps } from 'scenes/types';
import useAdminRoute from 'util/useAdminRoute';
import AllowlistTabContent from './AllowlistTabContent';
import DormTabContent from './DormTabContent';
import RedeemableCodeTabContent from './RedeemableCodeTabContent';
import UserTabContent from './UserTabContent';

function TabPanel({
  value,
  index,
  children,
}: {
  value: number;
  index: number;
  children: JSX.Element;
}) {
  if (value !== index) {
    return null;
  }
  return children;
}

export default function AdminPage(_props: SceneProps) {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = useCallback(
    (_event, newValue) => {
      setTabIndex(newValue);
    },
    [setTabIndex]
  );

  const adminRedirect = useAdminRoute();
  if (adminRedirect) {
    return adminRedirect;
  }

  return (
    <>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Users" />
        <Tab label="Allowlist" />
        <Tab label="Dorms" />
        <Tab label="Promo codes" />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <UserTabContent />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <AllowlistTabContent />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <DormTabContent />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <RedeemableCodeTabContent />
      </TabPanel>
    </>
  );
}
