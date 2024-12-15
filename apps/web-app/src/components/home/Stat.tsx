import Additional from './Additional';
import { Trans } from 'react-i18next';
import { AdditionalProps } from './Additional';
import { Translation } from '@darkthrone/interfaces';

interface StatProps {
  stat: string;
  translation?: Translation;
  value: number | string;
  additional?: AdditionalProps;
}
export default function Stat({
  stat,
  translation,
  value,
  additional,
}: StatProps) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-zinc-800 px-4 py-8 sm:px-6 xl:px-8">
      <dt className="text-sm font-medium leading-6 text-zinc-400">
        <Trans
          i18nKey={(translation && translation?.key) || stat}
          {...(translation &&
            translation.values && { values: translation.values })}
        />
      </dt>
      <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-zinc-200">
        {value}
      </dd>
      {additional && <Additional translation={additional.translation} />}
    </div>
  );
}
