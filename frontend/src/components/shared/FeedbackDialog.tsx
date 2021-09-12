import React, { FormEvent, useState } from 'react';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Rating from '@material-ui/lab/Rating';
import { Locale } from 'scenes/types';
import { Connection } from 'twilio-client';
import { PrimaryButton } from './RoundedButton';

interface FeedbackDialogProps extends DialogProps {
  locale: Locale;
  onSubmitFeedback: (
    feedback: number,
    issue?: Connection.FeedbackIssue
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
    'Call got disconnected': Connection.FeedbackIssue.DroppedCall,
    'Lag in audio': Connection.FeedbackIssue.AudioLatency,
    "Can't hear one another": Connection.FeedbackIssue.OneWayAudio,
    'Sound breaking up': Connection.FeedbackIssue.ChoppyAudio,
    'Poor audio quality': Connection.FeedbackIssue.NoisyCall,
    'Audible echos during call': Connection.FeedbackIssue.Echo,
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

export default function FeedbackDialog({
  locale,
  open,
  onClose,
  onSubmitFeedback,
}: FeedbackDialogProps) {
  const [feedback, setFeedback] = useState<number | null>(null);
  const [problem, setProblem] = useState<Connection.FeedbackIssue | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // pass problem only when feedback is less than perfect
    if (feedback) {
      onSubmitFeedback(feedback, problem || undefined);
    }
    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  };

  return (
    <Dialog
      fullWidth
      disableBackdropClick
      maxWidth="sm"
      open={open}
      onClose={onClose}
    >
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
                setProblem(event.target.value as Connection.FeedbackIssue)
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
