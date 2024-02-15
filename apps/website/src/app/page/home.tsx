import { DevicePhoneMobileIcon, TrophyIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <>
      <div
        className='
          h-96
          flex items-center justify-center
          relative
        '
      >
        <video className='absolute w-full h-full object-cover' autoPlay muted loop src='/background.mp4' />
        <div className='absolute w-full h-full bg-black/50' />
        <button
          className='
            relative
            bg-zinc-800
            text-white
            text-lg
            font-display
            py-2 px-4

            border
            border-white
            outline
            outline-zinc-800
          '
        >
          Play
        </button>
      </div>

      <div className="
        bg-zinc-700
        px-4 lg:px-0
      ">
        <div
          className='
            max-w-screen-lg
            mx-auto

            text-white
            text-center

            py-32
          '
        >

          <h1 className='font-display text-4xl mb-6'>About the project</h1>
          <p>
            Project Dark Curse is an open sourse re-creation of the classic MMO
            Dark Throne originally created by Lazarus Software. That game is
            gone now but this project aims to bring back the spirit of that
            game. The primary goal of that project is to create a game that
            emulates the same experience as the original. Afterwards, the goal
            is to continually add additional features with the backing of the
            community to push this game into the future.
          </p>
        </div>
      </div>

      <div className="bg-zinc-800">
        <div
          className='
            max-w-screen-lg
            mx-auto
            flex justify-around

            text-white

            py-24
          '
        >

          <div className='w-1/3 px-6'>
            <TrophyIcon className='w-20 mx-auto mb-6' />
            <h2 className='text-2xl font-display text-center mb-6'>The game you loved</h2>
            <p className='text-center text-zinc-400'>This project aims to maintain the same experience and gameplay as the classic MMORPG Dark Throne</p>
          </div>
          <div className='w-1/3 px-6'>
            <DevicePhoneMobileIcon className='w-20 mx-auto mb-6' />
            <h2 className='text-2xl font-display text-center mb-6'>Built for Mobile</h2>
            <p className='text-center text-zinc-400'>First class mobile support for play on the go. With option sin the future to expand into native mobile applications.</p>
          </div>
          <div className='w-1/3 px-6'>
            <UserGroupIcon className='w-20 mx-auto mb-6' />
            <h2 className='text-2xl font-display text-center mb-6'>Community focused</h2>
            <p className='text-center text-zinc-400'>The community will have a strong voice in shaping the future of the game with feature suggestions and voting.</p>
          </div>

        </div>
      </div>
    </>
  )
}
