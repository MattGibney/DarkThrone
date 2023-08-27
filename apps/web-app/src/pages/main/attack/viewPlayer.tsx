import DarkThroneClient, { PlayerObject } from '@darkthrone/client-library';
import { Avatar } from '@darkthrone/react-components';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface AttackViewPlayerPageProps {
  client: DarkThroneClient;
}
export default function AttackViewPlayerPage(props: AttackViewPlayerPageProps) {
  const { playerID } = useParams<{ playerID: string }>();

  const [player, setPlayer] = useState<PlayerObject | null | undefined>(undefined);

  useEffect(() => {
    const fetchPlayer = async () => {
      if (playerID === undefined) {
        setPlayer(null)
        return;
      }

      const playerFetch = await props.client.players.fetchByID(playerID);

      if(playerFetch.status === 'fail') {
        setPlayer(null);
        return;
      }

      setPlayer(playerFetch.data);
    };
    fetchPlayer();
  }, [playerID]);

  if (player === undefined) return;

  if (player === null) return (<div>Player not found</div>);

  const items = [
    { name: 'Attack' },
    { name: 'Message Player' },
    { name: 'Report' },
  ]

  return (
    <div className='mx-auto max-w-7xl flex'>
      <div className="w-80 flex flex-col gap-y-6">
        <section>
          <div className="aspect-square">
            <Avatar
              url={player.avatarURL}
              race={player.race}
              size='fill'
              variant='square'
            />
          </div>
          <div className='mt-4'>
            <h2 className='text-3xl font-semibold text-zinc-300'>{player.name}</h2>
            <p className='text-sm text-zinc-400 capitalize'>{player.race} {player.class}</p>
          </div>
        </section>

        <section>
          <p className='text-sm text-zinc-300'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi temporibus optio deleniti, natus eum tempora sed soluta nisi fugit alias ea, quo autem inventore quae porro voluptatem tempore molestiae aliquid!
          </p>
        </section>

        <section>
          <p className='text-sm text-zinc-400 flex gap-x-2'>
            <p><span className='font-semibold text-zinc-200'>10</span> Friends</p>
            &middot;
            <p><span className='font-semibold text-zinc-200'>5</span> Enemies</p>
          </p>
        </section>

        <hr className='border-zinc-700' />
      </div>

    </div>
  );
}
