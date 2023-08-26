import { NavLink } from 'react-router-dom';
import { classNames } from '../../utils';

// const navigation = [
//   {
//     name: 'Home',
//     children: [
//       { name: 'Overview', to: '/overview' },
//       { name: 'News', to: '/news' },
//       { name: 'Levels', to: '/levels' },
//       { name: 'Settings', to: '/settings' },
//       { name: 'FAQ', to: '/faq' },
//       { name: 'Support', to: '/support' },
//     ],
//   },
//   {
//     name: 'Battle',
//     children: [
//       { name: 'Attack', to: '/attack' },
//       { name: 'Training', to: '/training' },
//       { name: 'Mercenaries', to: '/mercenaries' },
//       { name: 'Upgrades', to: '/upgrades' },
//       { name: 'War History', to: '/war-history' },
//     ]
//   },
//   {
//     name: 'Structures',
//     children: [
//       { name: 'Bank', to: '/bank' },
//       { name: 'Armory', to: '/armory' },
//       { name: 'Upgrades', to: '/upgrades' },
//       { name: 'Housing', to: '/housing' },
//       { name: 'Repair', to: '/repair' },
//     ]
//   },
//   {
//     name: 'Alliances',
//     children: [
//       { name: 'My Alliances', to: '/my-alliances' },
//       { name: 'Alliance Listing', to: '/alliance-listing' },
//     ]
//   },
//   {
//     name: 'Community',
//     children: [
//       // { name: 'Downloads', to: '/downloads' },
//       { name: 'Friends', to: '/friends' },
//       { name: 'Rankings', to: '/rankings' },
//       // { name: 'Forum', to: '/forum' },
//       { name: 'Messaging', to: '/messaging' },
//       { name: 'Recruiter', to: '/recruiter' },
//     ]
//   },
// ];

export const navigation = [
  {
    name: 'Home',
    href: '/overview',
    children: [
      { name: 'Overview', to: '/overview' },
      { name: 'News', to: '/news' },
      { name: 'Levels', to: '/levels' },
      { name: 'Settings', to: '/settings' },
      { name: 'FAQ', to: '/faq' },
      { name: 'Support', to: '/support' },
    ]
  },
  {
    name: 'Battle',
    href: '/attack'
  },
  {
    name: 'Structures',
    href: '/bank'
  },
  {
    name: 'Alliances',
    href: '/my-alliances'
  },
  {
    name: 'Community',
    href: '/friends'
  },
];

export default function Navigation() {
  return (
    <nav className="flex flex-1 flex-col">
      <ul className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul className="-mx-2 space-y-1">
            {navigation.map((item, itemIdx) => (
              <li key={itemIdx}>
                <NavLink
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? 'bg-yellow-700/25 text-yellow-600'
                        : 'text-zinc-300 hover:text-primary-600 hover:bg-zinc-700/50',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    )
                  }
                  to={item.href}
                >
                  {({ isActive }) => (
                    <>
                      {item.name}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </li>

        {/* <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Disclosure as="div">
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={classNames(
                          open ? 'bg-zinc-700/50' : '',
                          'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-zinc-400'
                        )}
                      >
                        <ChevronRightIcon
                          className={classNames(
                            open ? 'rotate-90 text-zinc-500' : 'text-zinc-400',
                            'h-5 w-5 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Disclosure.Button>
                      <Disclosure.Panel as="ul" className="mt-1 px-2">
                        {item.children.map((subItem) => (
                          <li key={subItem.name}>
                            <NavLink
                              to={subItem.to}
                              className={({ isActive }) =>
                                classNames(
                                  isActive
                                    ? 'bg-zinc-700' : '',
                                  'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-zinc-400',
                                )
                              }
                            >
                              {subItem.name}
                            </NavLink>
                            {/* <Disclosure.Button
                              as="a"
                              href={subItem.href}
                              className={classNames(
                                subItem.current ? 'bg-zinc-50' : 'hover:bg-zinc-50',
                                'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-zinc-400'
                              )}
                            >
                              {subItem.name}
                            </Disclosure.Button> */}
                          {/* </li>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </li>
            ))}
          </ul>
        </li> */}
      </ul>
    </nav>
  );
}
