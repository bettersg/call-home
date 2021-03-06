import React, { useState } from 'react';
import ReportIssueDialog from 'components/shared/ReportIssueDialog';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import FeedbackIcon from '@material-ui/icons/Feedback';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useUserService } from 'contexts';
import { Locale } from 'scenes/types';

const STRINGS = {
  en: {
    CONTACTS_LOGOUT_LABEL: 'Logout',
    CONTACTS_REPORT_PROBLEM_LABEL: 'Report Problem',
  },
  bn: {
    CONTACTS_LOGOUT_LABEL: 'প্রস্থান', // Google translate
    CONTACTS_REPORT_PROBLEM_LABEL: 'সমস্যা রিপোর্ট করুন',
  },
};

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const openFeedbackDialog = () => setIsFeedbackDialogOpen(true);
  const logout = async () => {
    (window as any).location = '/oauth/logout';
  };
  const [userState] = useUserService();
  const { me: user } = userState || {};
  const ActionLink = withStyles((theme) => ({
    root: {
      cursor: 'pointer',
      display: 'flex',
      color: (theme as any).palette.primary[900],
    },
  }))(Typography);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '12px',
        padding: '8px',
      }}
    >
      <ActionLink variant="body1" role="button" onClick={openFeedbackDialog}>
        <FeedbackIcon />
        {STRINGS[locale].CONTACTS_REPORT_PROBLEM_LABEL}
      </ActionLink>
      <ActionLink variant="body1" role="button" onClick={logout}>
        <ExitToAppIcon style={{ transform: 'rotate(180deg)' }} />
        {STRINGS[locale].CONTACTS_LOGOUT_LABEL}
      </ActionLink>
      <ReportIssueDialog
        user={user}
        onClose={() => setIsFeedbackDialogOpen(false)}
        open={isFeedbackDialogOpen}
        locale={locale}
      />
    </div>
  );
}
