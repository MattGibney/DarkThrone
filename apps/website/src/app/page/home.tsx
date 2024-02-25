import {
  DevicePhoneMobileIcon,
  TrophyIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { environment } from '../../environments/environment';

export default function HomePage() {
  return (
    <>
      <div
        className="
          h-96
          flex items-center justify-center
          relative
        "
      >
        <video
          className="absolute w-full h-full object-cover"
          autoPlay
          muted
          loop
          src="/background.mp4"
        />
        <div className="absolute w-full h-full bg-black/50" />
        <Link
          to={environment.webAppUrl}
          className="
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
          "
        >
          Play
        </Link>
      </div>

      <div
        className="
        bg-zinc-700
        px-4 lg:px-0
      "
      >
        <div
          className="
            max-w-screen-lg
            mx-auto

            text-white
            text-center

            py-32
          "
        >
          <h1 className="font-display text-4xl mb-6">About the project</h1>
          <p className="text-zinc-200">
            DarkThrone Reborn is a re-creation of the classic MMO Dark Throne,
            originally created by Lazarus Software. That game is gone now but
            this project aims to bring back it back in spirit. The primary goal
            of the project is to create a game that emulates the same experience
            as the original. Afterwards, the goal is to continually add
            additional features with the backing of the community to push this
            game into the future.
          </p>
        </div>
      </div>

      <div className="bg-zinc-800">
        <div
          className="
            max-w-screen-lg
            mx-auto
            flex justify-around

            text-white

            py-24
          "
        >
          <div className="w-1/3 px-6">
            <TrophyIcon className="w-20 mx-auto mb-6" />
            <h2 className="text-2xl font-display text-center mb-6">
              The game you loved
            </h2>
            <p className="text-center text-zinc-400">
              We want to bring back the same experience as the classic MMORPG.
            </p>
          </div>
          <div className="w-1/3 px-6">
            <DevicePhoneMobileIcon className="w-20 mx-auto mb-6" />
            <h2 className="text-2xl font-display text-center mb-6">
              Built for Mobile
            </h2>
            <p className="text-center text-zinc-400">
              First class mobile support for play on the go. With options in the
              future to expand into native mobile applications.
            </p>
          </div>
          <div className="w-1/3 px-6">
            <UserGroupIcon className="w-20 mx-auto mb-6" />
            <h2 className="text-2xl font-display text-center mb-6">
              Community focused
            </h2>
            <p className="text-center text-zinc-400">
              The community will have a strong voice in shaping the future of
              the game with feature suggestions and voting.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
