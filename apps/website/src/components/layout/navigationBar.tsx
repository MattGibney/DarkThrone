import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'
import { navigation } from '../../app/app'

export default function NavigationBar() {
  return (
    <Disclosure as="nav" className='
      bg-zinc-800
      sticky
      top-0
      z-20

      px-4 lg:px-0
    '>
      {({ open, close }) => (
        <>
          <div className='
            text-white
            font-display

            max-w-screen-lg
            mx-auto

            py-6

            flex
            justify-between
            items-center
          '>
            <h1 className='text-3xl'>DarkThrone</h1>
            <div>
              <Disclosure.Button
                className='sm:hidden inline-flex items-center justify-center rounded-md text-zinc-400 hover:text-white'
              >
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
              <div className="hidden sm:flex space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => `hover:text-amber-600 ${isActive ? 'text-amber-500' : 'text-white'}`}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 flex flex-col font-display">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => `
                    hover:text-amber-600
                    ${isActive ? 'text-amber-500' : 'text-white'}
                  `}
                  onClick={() => close()}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
