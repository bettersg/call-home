import { useState, useEffect } from 'react';
import { Link } from '@mui/material';
import { getAppConfig, AppConfig } from '../../utils';
import { Path } from '../../routes/paths';
import { NavLink } from 'react-router-dom';
import { ReactComponent as CallHomeIcon } from './callhome-icon.svg';
import { ReactComponent as SupportIcon } from './support-icon.svg';
import { ReactComponent as MoreIcon } from './more-icon.svg';
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
        text="Call Home"
        icon={<CallHomeIcon />}
      />
      <NavIcon link={Path.Home} text="Support" icon={<SupportIcon />} />
      <NavIcon link={Path.Options} text="More" icon={<MoreIcon />} />
    </nav>
  );
}

function NavIcon(props: { link: string; text: string; icon: React.ReactNode }) {
  return (
    <div className="navbar-icon-container">
      <NavLink
        to={props.link}
        className={({ isActive }) =>
          `navbar-icon ${isActive ? 'navbar-icon-active' : ''}`
        }
      >
        {props.icon}
        <span className="navbar-icon-text">{props.text}</span>
      </NavLink>
    </div>
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
