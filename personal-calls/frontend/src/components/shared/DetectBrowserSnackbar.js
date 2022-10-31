import React, { useState } from 'react';
import { detect as detectBrowser } from 'detect-browser';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

const supportedBrowsers = new Set(['chrome', 'safari']);
const browser = detectBrowser();

export default function DetectBrowserSnackbar() {
  const [isOpen, setIsOpen] = useState(true);

  if (!browser || supportedBrowsers.has(browser.name)) {
    return null;
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsOpen(false);
  };

  return (
    <Snackbar open={isOpen} onClose={handleClose}>
      <Alert onClose={handleClose} severity="warning">
        We recommend using Chrome browser for the best calling experience!
      </Alert>
    </Snackbar>
  );
}
