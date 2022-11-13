import React, { FormEvent, useState } from 'react';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Rating from '@material-ui/lab/Rating';
import { Locale } from 'scenes/types';
import { Call as TwilioSdkCall } from '@twilio/voice-sdk';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import { PrimaryButton } from '../common/components/RoundedButton';

interface FeedbackDialogProps extends DialogProps {
  locale: Locale;
  onSubmitFeedback: (
    feedback: number,
    issue?: TwilioSdkCall.FeedbackIssue
  ) => unknown;
}

// Reference for Problem Keys: https://www.twilio.com/docs/voice/sdks/javascript/overview-1x-deprecated/connection
const EN_STRINGS = {
  FEEDBACK_DIALOG_TITLE: 'How was your call?',
  FEEDBACK_SUBMIT_LABEL: 'Submit',
  FEEDBACK_TITLES: {
    GOOD: 'GOOD',
    BAD: 'BAD',
  },
  PROBLEM_TITLES: {
    'Call got disconnected': TwilioSdkCall.FeedbackIssue.DroppedCall,
    'Lag in audio': TwilioSdkCall.FeedbackIssue.AudioLatency,
    "Can't hear one another": TwilioSdkCall.FeedbackIssue.OneWayAudio,
    'Sound breaking up': TwilioSdkCall.FeedbackIssue.ChoppyAudio,
    'Poor audio quality': TwilioSdkCall.FeedbackIssue.NoisyCall,
    'Audible echos during call': TwilioSdkCall.FeedbackIssue.Echo,
  },
};

const STRINGS = {
  en: EN_STRINGS,
  bn: {
    ...EN_STRINGS,
  },
};

// TODO move this to its own module
const withDialogButtonStyles = withStyles(() => ({
  root: {
    padding: '1em 2em',
    flex: '1 0',
    margin: '0 0.5rem',
  },
}));

const DialogPrimaryButton = withDialogButtonStyles(PrimaryButton);

const CloseDialogIconButton = withStyles(() => ({
  root: {
    position: 'absolute',
    right: '0',
    top: '0',
  },
}))(IconButton);

export default function FeedbackDialog({
  locale,
  open,
  onClose,
  onSubmitFeedback,
}: FeedbackDialogProps) {
  const [feedback, setFeedback] = useState<number | null>(null);
  const [problem, setProblem] = useState<TwilioSdkCall.FeedbackIssue | null>(
    null
  );

  const handleCloseDialog = () => {
    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // pass problem only when feedback is less than perfect
    if (feedback) {
      onSubmitFeedback(feedback, problem || undefined);
    }
    handleCloseDialog();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogActions>
        <CloseDialogIconButton
          onClick={() => {
            handleCloseDialog();
          }}
        >
          <CloseIcon />
        </CloseDialogIconButton>
      </DialogActions>
      <DialogTitle>{STRINGS[locale].FEEDBACK_DIALOG_TITLE}</DialogTitle>
      <form
        onSubmit={onSubmit}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ margin: '1em auto' }}>
          <Rating
            size="large"
            name="hover-feedback"
            value={feedback}
            precision={1}
            onChange={(_event, newValue) =>
              newValue ? setFeedback(newValue) : setFeedback(-1)
            }
          />
        </div>
        {feedback && feedback < 5 && feedback > 0 ? (
          <div style={{ margin: '1em auto', display: 'grid' }}>
            <RadioGroup
              aria-label="problem"
              name="problem"
              value={problem}
              onChange={(event) =>
                setProblem(event.target.value as TwilioSdkCall.FeedbackIssue)
              }
            >
              {Object.entries(STRINGS[locale].PROBLEM_TITLES).map(
                ([key, title]) => (
                  <FormControlLabel
                    key={key}
                    value={title}
                    control={<Radio color="primary" />}
                    label={key}
                  />
                )
              )}
            </RadioGroup>
          </div>
        ) : null}
        <DialogPrimaryButton
          style={{ margin: '1em 2em' }}
          type="submit"
          value="submit"
          disabled={!feedback || (!problem && feedback < 5)}
        >
          {STRINGS[locale].FEEDBACK_SUBMIT_LABEL}
        </DialogPrimaryButton>
      </form>
    </Dialog>
  );
}
