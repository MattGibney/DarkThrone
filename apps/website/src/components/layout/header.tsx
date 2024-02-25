import { screens } from '../../app/app';
import NavigationLink from '../navigationLink';

export default function Header() {
  return (
    <div className="bg-zinc-900">
      <div
        className="
          text-white
          flex
          justify-between
          font-display

          py-4
          text-xs

          max-w-screen-lg
          mx-auto

          px-4 lg:px-0
        "
      >
        <ul className="flex gap-4">
          {/* <li>English</li> */}
          <li>
            <NavigationLink linkData={screens['privacy']} />
          </li>
          <li>
            <NavigationLink linkData={screens['contact']} />
          </li>
        </ul>
        <ul className="flex gap-4">
          <li>Discord</li>
          <li>
            <NavigationLink linkData={screens['github']} />
          </li>
        </ul>
      </div>
    </div>
  );
}
