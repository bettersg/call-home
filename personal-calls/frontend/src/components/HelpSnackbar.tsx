import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { Locale } from 'scenes/types';
import { useFeatureService } from 'contexts';
import { Link } from '@mui/material';

const EN_STRINGS = {
  HELP_MESSAGE_NO_LOCK:
    'Make sure your screen doesn’t lock when you use Call Home! If your screen locks, your call may disconnect.',
  HELP_MESSAGE_VISIBLE_CHROME:
    'For the best calling experience, make sure Google Chrome is open and visible and that Call Home is showing on the Chrome page while you are using the app.',
  HELP_MESSAGE_NO_CLOSE_CHROME:
    'For the best calling experience, don’t close the Call Home website while you are on a call. If you close the website, your call may disconnect.',
  HELP_MESSAGE_NO_NAVIGATE_CHROME:
    'If your calls sometimes disconnect, try keeping the Call Home website open and do not go to other websites while you are on a call.',
  HELP_MESSAGE_CREDIT_CAP: (
    <>
      Call Home is working on some exciting new features! To give us time to
      develop the features, from 01 August 2022, each user will now get 80
      minutes each month. Learn more at our&nbsp;
      <Link href="https://callhome.sg/#new-call-limit">FAQ page</Link>
    </>
  ),
  HELP_MESSAGE_WIND_DOWN:
    'As the world reopens, it’s time for us to phase out Call Home. Please be informed that we will only be supporting calls for the next 2 weeks. You will no longer be able to make outgoing calls from 1st February 2024. Thank you for using our services for the last 3 years!',
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
  HELP_MESSAGE_CREDIT_CAP: (
    <>
      কল হোম এখন কিছু উত্তেজনাপূর্ণ নতুন বৈশিষ্ট্য কাজ করছে! এই বৈশিষ্ট্যগুলি
      বিকাশ করার জন্য আমাদের সময় দিতে, 1লা আগস্ট 2022 থেকে, প্রতিটি ব্যবহারকারী
      এখন প্রতি মাসে 80 মিনিট পাবেন। আমাদের&nbsp;
      <Link href="https://callhome.sg/#new-call-limit">FAQ</Link> পৃষ্ঠায় আরও
      জানুন।
    </>
  ),
};

const STRINGS = {
  en: EN_STRINGS,
  bn: BN_STRINGS,
};

function getRandomHelpMessage(locale: Locale): React.ReactNode {
  const helpStrings = Object.values(STRINGS[locale]);
  const randomIdx = Math.floor(Math.random() * helpStrings.length);
  return helpStrings[randomIdx];
}

export default function HelpSnackbar({ locale }: { locale: Locale }) {
  const [isOpen, setIsOpen] = useState(true);
  const [featureState] = useFeatureService();

  const handleClose = () => {
    setIsOpen(false);
  };

  // const helpMessage = featureState?.CREDIT_CAP
  //   ? STRINGS[locale].HELP_MESSAGE_CREDIT_CAP
  //   : getRandomHelpMessage(locale);

  return (
    <Snackbar open={isOpen} onClose={handleClose}>
      <Alert onClose={handleClose as any} severity="warning">
        {STRINGS[locale].HELP_MESSAGE_WIND_DOWN}
      </Alert>
    </Snackbar>
  );
}
