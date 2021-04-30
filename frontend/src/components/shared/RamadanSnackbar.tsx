import React, { useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { DateTime } from 'luxon';

const RAMADAN_START = DateTime.fromObject({
  year: 2021,
  month: 4,
  day: 12,
});

const RAMADAN_END = DateTime.fromObject({
  year: 2021,
  month: 5,
  day: 12,
});

export default function RamadanSnackbar() {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = (_event: unknown) => {
    setIsOpen(false);
  };

  const today = DateTime.fromJSDate(new Date());
  if (RAMADAN_START < today && RAMADAN_END > today) {
    return (
      <Snackbar open={isOpen} onClose={handleClose}>
        <Alert onClose={handleClose as any} severity="success">
          The Call Home team wishes all our Muslim brothers Ramadan Mubarak!
        </Alert>
      </Snackbar>
    );
  }
  return null;
}
