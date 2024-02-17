import { Link } from 'react-router-dom';
import { environment } from '../../environments/environment';

export default function Header() {
  return (
    <div className='bg-zinc-900'>
      <div
        className='
          text-white
          flex
          justify-between
          font-display

          py-4
          text-xs

          max-w-screen-lg
          mx-auto

          px-4 lg:px-0
        '
      >
        <ul className='flex gap-4'>
          {/* <li>English</li> */}
          <li>Privacy</li>
          <li>Contact</li>
        </ul>
        <ul className='flex gap-4'>
          <li>Discord</li>
          <li>
            <Link
              to={environment.gitHubURL}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-amber-500'
            >
              Github
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
