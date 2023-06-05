import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useDormService, useUserService } from 'contexts';

import { validateDorm } from 'services/DormValidation';
import { Container, PrimaryButton } from 'components';
import { SceneProps } from 'scenes/types';

const EN_STRINGS = {
  VERIFY_DORM_TITLE: 'Which dorm do you stay in?',
  VERIFY_DORM_OTHERS_DORM: 'Others',
  NEXT: 'Next',
};
const STRINGS = {
  en: EN_STRINGS,
  bn: {
    ...EN_STRINGS,
  },
};

export default function VerifyDorm({ locale }: SceneProps) {
  const [dormState, dormService] = useDormService();
  const [, userService] = useUserService();
  // Use -1 as a magic constant because a number value must be supplied.
  const [selectedDormId, setSelectedDormId] = useState<number>(-1);

  useEffect(() => {
    if (dormService) {
      dormService.refreshDorms();
    }
  }, [dormService]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedDormId) {
      return;
    }
    // Set the dormId to null if it is the default
    const dormId = selectedDormId === -1 ? null : selectedDormId;
    await validateDorm(dormId);
    userService?.refreshSelf();
  };

  return (
    <Container>
      <Typography variant="h2" component="h1" style={{ marginBottom: '12px' }}>
        {STRINGS[locale].VERIFY_DORM_TITLE}
      </Typography>
      <form
        onSubmit={onSubmit}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Select
          variant="outlined"
          value={selectedDormId}
          onChange={(event) => setSelectedDormId(event.target.value as number)}
        >
          {dormState?.dorms?.map((dorm) => (
            <MenuItem key={dorm.id} value={dorm.id}>
              {dorm.name}
            </MenuItem>
          ))}
          <MenuItem key={-1} value={-1}>
            {STRINGS[locale].VERIFY_DORM_OTHERS_DORM}
          </MenuItem>
        </Select>
        <PrimaryButton
          disableFocusRipple
          color="primary"
          type="submit"
          value="submit"
          style={{
            marginTop: 'auto',
          }}
        >
          {STRINGS[locale].NEXT}
        </PrimaryButton>
      </form>
    </Container>
  );
}
