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
    href: '/attack',
    children: [
      { name: 'Attack', to: '/attack' },
      { name: 'Training', to: '/training' },
      { name: 'Mercenaries', to: '/mercenaries' },
      { name: 'Upgrades', to: '/upgrades' },
      { name: 'War History', to: '/war-history' },
    ]
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
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
}
