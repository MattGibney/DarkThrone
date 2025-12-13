import { Button } from '@darkthrone/shadcnui/button';
import {
  DevicePhoneMobileIcon,
  TrophyIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
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
        {/* This button has styling overrides as it needs to sit outside of the theme. */}
        <Button
          asChild
          variant="default"
          size="lg"
          className="
            relative

            bg-background/80
            hover:bg-background
            text-foreground

            ring-1 outline-secondary ring-offset-1

            font-display
            text-lg"
        >
          <a
            href={environment.webAppUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Play
          </a>
        </Button>
      </div>

      <div
        className="
        bg-muted/80
        px-4 lg:px-0
      "
      >
        <div
          className="
            max-w-5xl
            mx-auto

            text-foreground
            text-center

            py-32
          "
        >
          <h1 className="font-display text-4xl mb-6">About the project</h1>
          <p className="text-foreground/80">
            DarkThrone Reborn is a re-creation of the classic MMO Dark Throne,
            originally created by Lazarus Software. That game is gone now but
            this project aims to bring back it back in spirit. Our primary goal
            is to create a game that emulates the same experience as the
            original, a spiritual successor. Afterwards, the goal is to
            continually add additional features with the backing of the
            community to push this game into the future.
          </p>
        </div>
      </div>

      <div className="bg-background">
        <div
          className="
            max-w-5xl
            mx-auto
            flex justify-around

            text-foreground

            py-24
          "
        >
          <div className="w-1/3 px-6">
            <TrophyIcon className="w-20 mx-auto mb-6" />
            <h2 className="text-2xl font-display text-center mb-6">
              The game you loved
            </h2>
            <p className="text-center text-foreground/60">
              We want to bring back the same experience as the classic MMORPG.
            </p>
          </div>
          <div className="w-1/3 px-6">
            <DevicePhoneMobileIcon className="w-20 mx-auto mb-6" />
            <h2 className="text-2xl font-display text-center mb-6">
              Built for Mobile
            </h2>
            <p className="text-center text-foreground/60">
              First class mobile support for play on the go. With options in the
              future to expand into native mobile applications.
            </p>
          </div>
          <div className="w-1/3 px-6">
            <UserGroupIcon className="w-20 mx-auto mb-6" />
            <h2 className="text-2xl font-display text-center mb-6">
              Community focused
            </h2>
            <p className="text-center text-foreground/60">
              The community will have a strong voice in shaping the future of
              the game with feature suggestions and voting.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
