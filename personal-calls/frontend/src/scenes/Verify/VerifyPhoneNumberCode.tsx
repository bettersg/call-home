import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {
  Container as ContainerWrong,
  Footer,
  PrimaryButton,
  RoundedButton,
} from 'components';
import { useUserService } from 'contexts';
import { beginPhoneNumberValidation, login } from 'services/Auth';
import { SceneProps } from 'scenes/types';

interface VerifyPhoneNumberCodeProps extends SceneProps {
  phoneNumber: string;
}

const Container: React.FunctionComponent<any> = ContainerWrong;

// TODO figure out where to put these later
const EN_STRINGS = {
  VERIFY_PHONE_NUMBER_VERIFICATION_TITLE:
    'Enter the verification code sent to {phoneNumber}',
  VERIFY_PHONE_NUMBER_WRONG_CODE_TITLE: 'Wrong code',
  VERIFY_PHONE_NUMBER_VERIFICATION_CODE_LABEL: 'Verfication code',
  VERIFY_PHONE_NUMBER_RESEND_CODE_LABEL: 'Resend code',
  VERIFY_PHONE_NUMBER_SUBMIT_LABEL: 'Submit',
  VERIFY_PHONE_NUMBER_WHITELIST_ERROR_MESSAGE:
    // TODO park this here while we figure out localization
    'দুঃখিত, আপনার ফোন নম্বরটি এখনও এই অ্যাপটিতে যুক্ত করা হয়নি। যোগদানের জন্য, নিজেকে এই ওয়েটলিস্টে যুক্ত করুন: https://callhome.sg/join-our-waitlist/', // Sorry, your phone number has not yet been added to this app. To join, add yourself to this waitlist: https://callhome.sg/join-our-waitlist/
};
const STRINGS = {
  en: EN_STRINGS,
  bn: {
    ...EN_STRINGS,
    VERIFY_PHONE_NUMBER_VERIFICATION_TITLE:
      'আপনার মোবাইল নাম্বারে প্রেরিত কোডটি প্রবেশ করান ({phoneNumber})',
    VERIFY_PHONE_NUMBER_WRONG_CODE_TITLE: 'ভুল কোড',
    VERIFY_PHONE_NUMBER_VERIFICATION_CODE_LABEL: 'যাচাইকরণ কোড', // Google translate
    VERIFY_PHONE_NUMBER_RESEND_CODE_LABEL: 'পুনরায় পাঠানো কোড', // Google translate
    VERIFY_PHONE_NUMBER_SUBMIT_LABEL: 'জমা দিন', // Google translate
    /* VERIFY_PHONE_NUMBER_WHITELIST_ERROR_MESSAGE:
     *   ' Sorry, your phone number is not part of this programme. If you believe this is an error, reach out to an administrator.', */
  },
};

// TODO replace with better parsing like moment.js
function formatRateLimitExpiry(rateLimitExpiryMillis: number) {
  const totalSeconds = Math.round(rateLimitExpiryMillis / 1000);
  const seconds = totalSeconds % 60;
  const minutes = (totalSeconds - seconds) / 60;
  return `${minutes}:${seconds}`;
}

export default function VerificationPhoneNumberCode({
  locale,
  phoneNumber,
}: VerifyPhoneNumberCodeProps) {
  const [, userService] = useUserService();
  const [code, setCode] = useState('');
  const [hasBadOtpError, setHasBadOtpError] = useState(false);
  const [hasAllowlistError, setHasAllowlistError] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [rateLimitExpiry, setRateLimitExpiry] = useState(new Date());

  useEffect(() => {
    if (userService) {
      userService.refreshSelf();
    }
  }, [userService]);

  useEffect(() => {
    setInterval(() => setCurrentTime(new Date()), 1000);
  }, []);

  const handlePhoneNumberValidationRequest = async () => {
    try {
      if (phoneNumber) {
        await beginPhoneNumberValidation(phoneNumber);
      }
    } catch (error) {
      const { data } = error;
      if (data && data.message === 'PHONE_NUMBER_RATE_LIMITED' && data.body) {
        setRateLimitExpiry(new Date(data.body));
      } else {
        throw error;
      }
    }
  };

  useEffect(() => {
    handlePhoneNumberValidationRequest();
  }, [phoneNumber]);

  const onSubmit = async (event: any) => {
    event.preventDefault();
    try {
      await login(phoneNumber, code);
      await (userService as any).refreshSelf();
    } catch (error) {
      if (!error.data || !error.data.message) {
        throw error;
      }
      const { message } = error.data;
      if (message === 'NOT_WHITELISTED') {
        setHasAllowlistError(true);
      } else if (message === 'BAD_OTP') {
        setHasBadOtpError(true);
      }
    }
  };
  let content;
  if (hasAllowlistError) {
    content = (
      <div>
        {(STRINGS as any)[locale].VERIFY_PHONE_NUMBER_WHITELIST_ERROR_MESSAGE}
      </div>
    );
  } else {
    content = (
      <form onSubmit={onSubmit} style={{ height: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <div>
            <Typography
              variant="h5"
              component="h1"
              color={hasBadOtpError ? 'error' : 'inherit'}
              style={{ marginBottom: '12px' }}
            >
              {hasBadOtpError
                ? (STRINGS as any)[locale].VERIFY_PHONE_NUMBER_WRONG_CODE_TITLE
                : (STRINGS as any)[
                    locale
                  ].VERIFY_PHONE_NUMBER_VERIFICATION_TITLE.replace(
                    '{phoneNumber}',
                    phoneNumber
                  )}
            </Typography>
            <TextField
              fullWidth
              label={
                (STRINGS as any)[locale]
                  .VERIFY_PHONE_NUMBER_VERIFICATION_CODE_LABEL
              }
              value={code}
              onChange={(error) => setCode(error.target.value)}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <RoundedButton
              style={{
                width: '30%',
              }}
              variant="contained"
              disabled={Number(rateLimitExpiry) - Number(currentTime) > 0}
              disableElevation
              onClick={handlePhoneNumberValidationRequest}
            >
              {Number(rateLimitExpiry) - Number(currentTime) > 0
                ? formatRateLimitExpiry(
                    Number(rateLimitExpiry) - Number(currentTime)
                  )
                : (STRINGS as any)[locale]
                    .VERIFY_PHONE_NUMBER_RESEND_CODE_LABEL}
            </RoundedButton>
            <PrimaryButton
              style={{
                width: '30%',
              }}
              variant="contained"
              disableElevation
              type="submit"
              value="submit"
            >
              {(STRINGS as any)[locale].VERIFY_PHONE_NUMBER_SUBMIT_LABEL}
            </PrimaryButton>
          </div>
        </div>
      </form>
    );
  }
  return (
    <Container>
      {content}
      <Footer locale={locale} />
    </Container>
  );
}
