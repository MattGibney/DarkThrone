import { PlayerRace } from '@darkthrone/client-library';
import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    container: 'text-center h-40 p-2 border-2 rounded-lg flex flex-col cursor-pointer',
  },
  variants: {
    race: {
      human: {
        container: 'border-sky-400',
      },
      elf: {
        container: 'border-emerald-400',
      },
      goblin: {
        container: 'border-zinc-400',
      },
      undead: {
        container: 'border-zinc-400',
      },
    },
    selectedRace: {
      human: {
        container: 'bg-sky-600/25',
      },
      elf: {
        container: 'bg-emerald-600/25',
      },
      goblin: {
        container: 'bg-zinc-600/25',
      },
      undead: {
        container: 'bg-zinc-600/75',
      },
    }
  }
});

export interface RaceCardProps {
  name: string;
  race: PlayerRace;
  selectedRace?: PlayerRace;
  icon: () => JSX.Element;
  bonusText: string;
}
export default function RaceCard(props: RaceCardProps) {
  const { container } = styles({ race: props.race, selectedRace: props.selectedRace });
  return (
    <div className={container()}>
      <div className='grow flex flex-col justify-center items-center'>
        {props.icon()}
      </div>
      <h3 className='font-bold'>{props.name}</h3>
      <p className='text-sm text-zinc-400'>{props.bonusText}</p>
    </div>
  );
}
