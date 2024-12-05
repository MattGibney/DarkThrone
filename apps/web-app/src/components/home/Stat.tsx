import Additional from './Additional';

interface StatProps {
  name: string;
  value: string | number;
  additional?: string | number;
}
export default function Stat({ name, value, additional }: StatProps) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-zinc-800 px-4 py-8 sm:px-6 xl:px-8">
      <dt className="text-sm font-medium leading-6 text-zinc-400">{name}</dt>
      <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-zinc-200">
        {value}
      </dd>
      {additional && <Additional additional={additional} />}
    </div>
  );
}
