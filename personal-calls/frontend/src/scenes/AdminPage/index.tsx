import React, { useCallback, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import useAdminRoute from 'util/useAdminRoute';
import DormTabContent from './DormTabContent';
import RedeemableCodeTabContent from './RedeemableCodeTabContent';

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

export default function AdminPage() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = useCallback(
    (_event: unknown, newValue: number) => {
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
        <Tab label="Dorms" />
        <Tab label="Promo codes" />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <DormTabContent />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <RedeemableCodeTabContent />
      </TabPanel>
    </>
  );
}
