import React, { useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { DateTime } from 'luxon';
import { Locale } from 'scenes/types';

const EN_STRINGS = {
  HELP_MESSAGE_NO_LOCK:
    'Make sure your screen doesn’t lock when you use Call Home! If your screen locks, your call may disconnect.',
  HELP_MESSAGE_VISIBLE_CHROME:
    'For the best calling experience, make sure Google Chrome is open and visible and that Call Home is showing on the Chrome page while you are using the app.',
  HELP_MESSAGE_NO_CLOSE_CHROME:
    'For the best calling experience, don’t close the Call Home website while you are on a call. If you close the website, your call may disconnect.',
  HELP_MESSAGE_NO_NAVIGATE_CHROME:
    'If your calls sometimes disconnect, try keeping the Call Home website open and do not go to other websites while you are on a call.',
};

const BN_STRINGS = {
  ...EN_STRINGS,
  HELP_MESSAGE_NO_LOCK:
    'আপনি কল হোম ব্যবহার করার সময় আপনার স্ক্রীনটি লক না হয়ে রয়েছে তা নিশ্চিত করুন! যদি আপনার স্ক্রিনটি লক হয় তবে আপনার কলটি সংযোগ বিচ্ছিন্ন হতে পারে।',
  HELP_MESSAGE_VISIBLE_CHROME:
    'সেরা কলিং অভিজ্ঞতার জন্য, গুগল ক্রোম খোলা এবং দৃশ্যমান এবং আপনি অ্যাপটি ব্যবহার করার সময় সেই কল হোমটি Chrome পৃষ্ঠায় প্রদর্শিত হচ্ছে তা নিশ্চিত করুন।',
  HELP_MESSAGE_NO_CLOSE_CHROME:
    'সেরা কলিং অভিজ্ঞতার জন্য, আপনি কলটিতে থাকার সময় কল হোম ওয়েবসাইটটি বন্ধ করবেন না। আপনি যদি ওয়েবসাইটটি বন্ধ করেন তবে আপনার কলটি সংযোগ বিচ্ছিন্ন হতে পারে।',
  HELP_MESSAGE_NO_NAVIGATE_CHROME:
    'যদি আপনার কলগুলি মাঝে মাঝে সংযোগ বিচ্ছিন্ন হয়, কল হোম ওয়েবসাইটটি উন্মুক্ত রাখার চেষ্টা করুন এবং আপনি কোনও কল করার সময় অন্য ওয়েবসাইটগুলিতে যাবেন না।',
};

const STRINGS = {
  en: EN_STRINGS,
  bn: BN_STRINGS,
};

function getRandomHelpMessage(locale: Locale): string {
  const helpStrings = Object.values(STRINGS[locale]);
  const randomIdx = Math.floor(Math.random() * helpStrings.length);
  return helpStrings[randomIdx];
}

export default function HelpSnackbar({ locale }: { locale: Locale }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = (_event: unknown) => {
    setIsOpen(false);
  };

  return (
    <Snackbar open={isOpen} onClose={handleClose}>
      <Alert onClose={handleClose as any} severity="warning">
        {getRandomHelpMessage(locale)}
      </Alert>
    </Snackbar>
  );
}
