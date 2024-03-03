import { Logo } from '@darkthrone/react-components';
import { screens } from '../../app/app';
import NavigationLink from '../navigationLink';

export default function Footer() {
  return (
    <div className="bg-zinc-900 py-12 px-4 xl:px-0">
      <div className="max-w-screen-lg mx-auto justify-around flex-wrap gap-0 text-zinc-400 grid grid-cols-4">
        <div className="w-full mb-6 sm:mb-0">
          <Logo variant="short" />
          <div className="mt-4">
            <iframe
              src="https://status.darkthronereborn.com/badge?theme=dark"
              width="100%"
              height="30"
              title="DarkThrone Reborn Status"
            ></iframe>
          </div>
        </div>

        <div className="w-full mb-6 sm:mb-0">
          <h5 className="text-2xl font-display mb-2">Support</h5>
          <ul>
            <li>
              <NavigationLink linkData={screens['status']} />
            </li>
            <li>
              <NavigationLink linkData={screens['discord']} />
            </li>
            <li>
              <NavigationLink linkData={screens['bugReport']} />
            </li>
          </ul>
        </div>

        <div className="w-full mb-6 sm:mb-0">
          <h5 className="text-2xl font-display mb-2">Project</h5>
          <ul>
            <li>
              <NavigationLink linkData={screens['roadmap']} />
            </li>
            <li>
              <NavigationLink linkData={screens['contributors']} />
            </li>
            <li>
              <NavigationLink linkData={screens['github']} />
            </li>
            <li>
              <NavigationLink linkData={screens['news']} />
            </li>
          </ul>
        </div>

        <div className="w-full">
          <h5 className="text-2xl font-display mb-2">Legal</h5>
          <ul>
            <li>
              <NavigationLink linkData={screens['privacy']} />
            </li>
            <li>
              <NavigationLink linkData={screens['terms']} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
