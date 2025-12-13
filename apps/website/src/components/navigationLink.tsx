import { Link } from 'react-router-dom';
import { NavigationItem } from '../app/app';

interface NavigationLinkProps {
  linkData: NavigationItem;
}
export default function NavigationLink(props: NavigationLinkProps) {
  const isExternal = props.linkData.href.startsWith('http');
  return (
    <Link
      to={props.linkData.href}
      className="hover:text-primary"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {props.linkData.name}
    </Link>
  );
}
