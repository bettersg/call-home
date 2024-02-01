import { useState, useEffect } from 'react';
import { Link } from '@mui/material';
import { getAppConfig, AppConfig } from '../../utils';
import { ReactComponent as CallHomeIcon } from './callhome-icon.svg';
import './NavBar.css';

function NavBar() {
  // TODO if we add other consumers of app config, turn this into its own hook.
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
  useEffect(() => {
    setAppConfig(getAppConfig());
  }, []);

  if (!appConfig) {
    return null;
  }

  // TODO Accept the text as props instead of hardcoding them; hardcoding won't
  // work with i18n.
  return (
    <nav className="navbar">
      <ExternalNavIcon
        link={appConfig.personalCallsUrl}
        text="Call Home v1"
        icon={<CallHomeIcon />}
      />
    </nav>
  );
}

function ExternalNavIcon(props: {
  link: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="navbar-icon-container">
      <Link
        href={props.link}
        className="navbar-icon"
        underline="none"
        color="grey.medium"
      >
        {props.icon}
        <span className="navbar-icon-text">{props.text}</span>
      </Link>
    </div>
  );
}

export { NavBar };
