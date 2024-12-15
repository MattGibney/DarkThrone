import { Translation } from '@darkthrone/interfaces';
import { Trans } from 'react-i18next';

export interface AdditionalProps {
  translation: Translation;
}

export default function Additional({ translation }: AdditionalProps) {
  return (
    <dd className="w-half flex-none text-base font-thin leading-10 tracking-tight text-zinc-200">
      <Trans
        i18nKey={translation.key}
        values={translation.values}
        context={translation.context}
      />
    </dd>
  );
}
