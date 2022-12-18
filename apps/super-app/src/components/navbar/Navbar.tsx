import './NavBar.css';
import { NavLink } from 'react-router-dom';
import { ReactComponent as CallHomeIcon } from '../img/callhomeicon.svg';
import { ReactComponent as SupportIcon } from '../img/supporticon.svg';
import { ReactComponent as MoreIcon } from '../img/moreicon.svg';

export const NavBar = () => {
  return (
    <nav className="navbar">
      <NavIcon link="../callhome" text="Call Home" icon={<CallHomeIcon />} />
      <NavIcon link="../support" text="Support" icon={<SupportIcon />} />
      <NavIcon link="../more" text="More" icon={<MoreIcon />} />
    </nav>
  );
};

function NavIcon(props: { link: string; text: string; icon: React.ReactNode }) {
  return (
    <div>
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
