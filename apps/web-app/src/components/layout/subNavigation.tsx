import { NavLink } from 'react-router-dom';

interface SubNavigationProps {
  tabs: { name: string; to: string; }[]
}
export default function SubNavigation(props: SubNavigationProps) {
  return (
    <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-none bg-white/5 py-2 pl-3 pr-10 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm"
            // defaultValue={props.tabs.find((tab) => tab.current).name}
          >
            {props.tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex border-b border-white/10 py-4">
            <ul
              className="flex min-w-full flex-none gap-x-6 px-2 text-sm font-semibold leading-6 text-gray-400"
            >
              {props.tabs.map((tab) => (
                <li key={tab.name}>
                  <NavLink
                    to={tab.to}
                    className={({ isActive }) => (isActive ? 'text-yellow-600' : '')}
                  >
                    {tab.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
