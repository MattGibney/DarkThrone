export default function Footer() {
  return (
    <>
      <div className='
        bg-zinc-900
        py-12
        px-4 xl:px-0
      '>

        <div className='
          max-w-screen-lg mx-auto

          flex justify-around flex-wrap gap-0
        '>

          <div className='w-full mb-6 sm:mb-0 sm:w-1/4'>
            <p className='text-3xl font-display text-zinc-500'>Dark Curse</p>
            <p className='text-zinc-400 text-sm'>Open source MMORPG</p>
          </div>

          <div className='w-full mb-6 sm:mb-0 sm:w-1/4'>
            <h5 className='text-2xl font-display text-zinc-400 mb-2'>Support</h5>
            <ul>
              <FooterLink label='Game Status' />
              <FooterLink label='Discord' />
              <FooterLink label='Bug Report' />
              <FooterLink label='API Docs' />
            </ul>
          </div>

          <div className='w-full mb-6 sm:mb-0 sm:w-1/4'>
            <h5 className='text-2xl font-display text-zinc-400 mb-2'>Project</h5>
            <ul>
              <FooterLink label='About' />
              <FooterLink label='Contributors' />
              <FooterLink label='Github' />
              <FooterLink label='News' />
              <FooterLink label='Press' />
            </ul>
          </div>

          <div className='w-full sm:w-1/4'>
            <h5 className='text-2xl font-display text-zinc-400 mb-2'>Legal</h5>
            <ul>
              <FooterLink label='Privacy Policy' />
              <FooterLink label='Terms and Conditions' />
            </ul>
          </div>

        </div>
      </div>
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2056 300"
        className='

        '
      >
        <path fill="#18181b" d="M0 0h2056v300H0z"/>
        <path fill="#d97706" d="M0 63h29c28-1 85-1 142-4s115-7 172-8 114 3 171 8 114 11 171 19 115 16 172 21a1087 1087 0 0 0 342-24c57-11 115-22 172-24 57-1 114 7 171 15 57 7 114 14 171 11 57-4 115-16 172-25s114-13 143-16l28-2v267H0Z"/>
        <path fill="#cd6e0a" d="m0 98 29 2c28 3 85 7 142 1 57-7 115-25 172-31s114 0 171 7c57 8 114 16 171 13s115-18 172-17 114 19 171 20 114-14 171-14 115 16 172 16 114-14 171-20 114-3 171 0c57 2 115 4 172 11s114 19 143 25l28 6v184H0Z"/>
        <path fill="#c1650d" d="m0 127 29-3c28-3 85-9 142-11 57-1 115 1 172 5s114 8 171 9 114-3 171-3 115 2 172 7 114 12 171 8 114-18 171-19c57-2 115 11 172 11 57 1 114-11 171-11s114 12 171 16c57 3 115 0 172-4l143-8 28-2v179H0Z"/>
        <path fill="#b55c0f" d="m0 146 29-3c28-4 85-10 142-10 57-1 115 6 172 5 57-2 114-10 171-9 57 0 114 11 171 12 57 2 115-5 172-6 57-2 114 3 171 8s114 10 171 10 115-7 172-8c57-2 114 2 171 4s114 3 171 1 115-6 172-7 114 2 143 4l28 1v153H0Z"/>
        <path fill="#a95410" d="m0 191 29-3c28-3 85-9 142-18 57-8 115-20 172-20s114 12 171 18 114 7 171 5c57-3 115-9 172-10s114 4 171 8 114 7 171 7c57-1 115-7 172-4 57 2 114 11 171 14 57 2 114-4 171-9a3956 3956 0 0 1 315-15h28v137H0Z"/>
        <path fill="#9d4c10" d="m0 186 29-1 142-7c57-3 115-4 172-1 57 4 114 13 171 20s114 12 171 11 115-8 172-15c57-8 114-16 171-15 57 0 114 10 171 12 57 3 115-1 172-6 57-4 114-10 171-12 57-3 114-4 171 0 57 3 115 9 172 15l143 13 28 2v99H0Z"/>
        <path fill="#904410" d="m0 231 29-3c28-3 85-10 142-15s115-10 172-5c57 4 114 18 171 18 57 1 114-12 171-12 57-1 115 9 172 10 57 0 114-10 171-16 57-5 114-7 171-7a4932 4932 0 0 1 343 12c57 6 114 15 171 16s115-6 172-13l143-16 28-3v104H0Z"/>
        <path fill="#843c10" d="m0 231 29 4c28 4 85 11 142 13s115-3 172-2c57 0 114 5 171 3s114-11 171-16 115-6 172-4 114 8 171 13 114 11 171 9c57-1 115-10 172-10 57-1 114 6 171 11 57 4 114 6 171 4s115-9 172-11 114 1 143 2l28 1v53H0Z"/>
        <path fill="#78350f" d="m0 274 29 1c28 2 85 4 142 5 57 0 115-3 172-2 57 0 114 2 171-1s114-12 171-17 115-5 172-2c57 4 114 12 171 13 57 2 114-4 171-7s115-4 172-6 114-4 171-3 114 6 171 8 115 1 172 2 114 4 143 6l28 1v29H0Z"/>
      </svg> */}
    </>
  );
}

interface FooterLinkProps {
  label: string;
}
function FooterLink(props: FooterLinkProps) {
  return <li className='text-zinc-400'>{props.label}</li>;
}
