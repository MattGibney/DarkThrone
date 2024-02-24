import { Button, Logo } from '@darkthrone/react-components';
import environment from '../environments/environment';

export function App() {
  function handlePlayClick() {
    window.location.href = environment.gameAppUrl;
  }

  return (
    <div className='sm:h-screen sm:grid sm:place-items-center'>
      <div className='max-w-md mx-auto flex flex-col sm:bg-zinc-800 p-4 rounded-md'>
        <div className='mx-auto my-6 pb-6 border-b border-zinc-600'>
          <Logo variant='large' />
        </div>

        <div className='text-zinc-300 mb-6'>
          <p className='mb-3'>Welcome to DarkThrone Reborn!</p>
          <p className='mb-3'>This is a passion project that I'm working on in my free time and is currently very much in early-alpha. I wanted to get a Minimum Viable Product put together and then develop it with feedback from the community.</p>
          <p className='mb-3'>In this limited version of the game, you can have multiple player accounts, train units and attack one another. Over time, functionality will improve and I really look forward to gathering feedback and comments from the players.</p>
          <p className='mb-3'>I hope you enjoy the game and I'm looking forward to hearing from you!</p>
        </div>

        <Button text={'Play DarkThrone Reborn'} onClick={handlePlayClick} />
      </div>
    </div>
  );
}

export default App;
