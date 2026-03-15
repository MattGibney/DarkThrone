import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@darkthrone/shadcnui/alert';
import { AlertCircleIcon } from 'lucide-react';

interface InlineErrorAlertProps<T extends string> {
  errors: T[];
  errorTranslations: Record<T, string>;
  title?: string;
}

export function InlineErrorAlert<T extends string>({
  errors,
  errorTranslations,
  title = 'There was a problem',
}: InlineErrorAlertProps<T>) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className="text-sm [&>svg]:size-4">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <ul className="list-inside list-disc text-sm">
          {errors.map((errorCode, index) => (
            <li key={`${errorCode}-${index}`}>
              {errorTranslations[errorCode]}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
