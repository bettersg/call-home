import { Path } from '../../routes/paths';
import { NavLink } from 'react-router-dom';
import { ReactComponent as CallHomeIcon } from './callhome-icon.svg';
import { ReactComponent as SupportIcon } from './support-icon.svg';
import { ReactComponent as MoreIcon } from './more-icon.svg';
import './NavBar.css';

function NavBar() {
  // TODO Accept the text as props instead of hardcoding them; hardcoding won't
  // work with i18n.
  return (
    <nav className="navbar">
      <NavIcon
        link={
          'TODO' /* TODO This has to link to app.callhome.sg, which
        doesn't work with NavLink.to */
        }
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

export { NavBar };
