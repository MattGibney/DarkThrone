import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, NavLink } from 'react-router-dom';
import { navigation, screens } from '../../app/app';
import { Logo } from '@darkthrone/react-components';

export default function NavigationBar() {
  return (
    <Disclosure
      as="nav"
      className="
      bg-muted
      sticky
      top-0
      z-20

      px-4 lg:px-0

      shadow shadow-background/30
    "
    >
      {({ open, close }) => (
        <>
          <div
            className="
            text-foreground
            font-display

            max-w-5xl
            mx-auto

            py-6

            flex
            justify-between
            items-center
          "
          >
            <Link to={screens['home'].href} className="select-none">
              <Logo />
            </Link>
            <div>
              <DisclosureButton className="sm:hidden inline-flex items-center justify-center rounded-md text-foreground/60 hover:text-foreground">
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </DisclosureButton>
              <div className="hidden sm:flex space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => `
                      hover:text-primary
                      ${isActive && !item.isExternal ? 'text-primary' : 'text-foreground/80'}
                    `}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pb-3 flex flex-col font-display">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => `
                    hover:text-primary
                    ${isActive && !item.isExternal ? 'text-primary' : 'text-white'}
                  `}
                  onClick={() => close()}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
