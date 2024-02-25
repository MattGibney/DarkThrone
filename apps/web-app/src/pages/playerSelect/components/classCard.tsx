import { tv } from 'tailwind-variants';

const styles = tv({
  slots: {
    container:
      'text-center p-2 border-2 border-zinc-600 rounded-lg flex flex-col cursor-pointer',
  },
  variants: {
    selected: {
      true: {
        container: 'border-yellow-600 bg-yellow-800/25',
      },
    },
  },
});

export interface ClassCardProps {
  name: string;
  class: 'fighter' | 'cleric' | 'thief' | 'assassin';
  bonusText: string;
  isSelected?: boolean;
}
export default function ClassCard(props: ClassCardProps) {
  const { container } = styles({ selected: props.isSelected });
  return (
    <div className={container()}>
      {/* <div className='grow flex flex-col justify-center items-center'>
        {props.icon()}
      </div> */}
      <h3 className="font-bold">{props.name}</h3>
      <p className="text-sm text-zinc-400">{props.bonusText}</p>
    </div>
  );
}
