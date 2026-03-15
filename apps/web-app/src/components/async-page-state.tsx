import { Button } from '@darkthrone/shadcnui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@darkthrone/shadcnui/card';
import { AlertCircleIcon, LoaderCircleIcon, SearchIcon } from 'lucide-react';
import { ComponentType, ReactNode } from 'react';

type AsyncPageStateVariant = 'loading' | 'error' | 'notFound';

interface AsyncPageStateProps {
  variant: AsyncPageStateVariant;
  title: string;
  description: string;
  actions?: ReactNode;
}

const stateIcons = {
  loading: LoaderCircleIcon,
  error: AlertCircleIcon,
  notFound: SearchIcon,
} satisfies Record<
  AsyncPageStateVariant,
  ComponentType<{ className?: string }>
>;

const stateIconClasses = {
  loading: 'animate-spin',
  error: '',
  notFound: '',
} satisfies Record<AsyncPageStateVariant, string>;

export function AsyncPageState(props: AsyncPageStateProps) {
  const Icon = stateIcons[props.variant];

  return (
    <main className="mx-auto max-w-4xl">
      <Card className="border-card-border">
        <CardHeader className="items-center text-center">
          <div className="rounded-full border border-card-border bg-card p-3 text-card-foreground/70">
            <Icon
              className={`size-6 ${stateIconClasses[props.variant]}`.trim()}
            />
          </div>
          <CardTitle>{props.title}</CardTitle>
          <CardDescription className="max-w-md text-balance">
            {props.description}
          </CardDescription>
        </CardHeader>
        {props.actions ? (
          <CardContent className="flex flex-wrap justify-center gap-3 pt-0">
            {props.actions}
          </CardContent>
        ) : null}
      </Card>
    </main>
  );
}

interface RetryPageStateProps {
  title: string;
  description: string;
  retryLabel?: string;
  onRetry: () => void;
  secondaryActions?: ReactNode;
}

export function RetryPageState(props: RetryPageStateProps) {
  return (
    <AsyncPageState
      variant="error"
      title={props.title}
      description={props.description}
      actions={
        <>
          <Button onClick={props.onRetry}>{props.retryLabel ?? 'Retry'}</Button>
          {props.secondaryActions}
        </>
      }
    />
  );
}
