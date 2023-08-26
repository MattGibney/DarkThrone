import { XCircleIcon } from '@heroicons/react/20/solid'
import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    container: "rounded-md p-4",
    icon: "h-5 w-5",
    title: "text-sm font-medium ",
    messageBody: "mt-2 text-sm",
  },
  variants: {
    type: {
      error: {
        container: "bg-zinc-800/25",
        icon: "text-zinc-400",
        title: "text-zinc-400",
        messageBody: "text-zinc-300",
      },
      warning: {
        container: "bg-yellow-800/25",
        icon: "text-yellow-400",
        title: "text-yellow-400",
        messageBody: "text-yellow-300",
      },
    }
  }
});

export interface AlertProps {
  title: string;
  messages: string[];
  type: "error" | "warning";
}

export function Alert(props: AlertProps) {
  const { container, icon, title, messageBody } = styles({ type: props.type });
  return (
    <div className={container()}>
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className={icon()} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className={title()}>{props.title}</h3>
          <div className={messageBody()}>
            {props.messages.length === 1 ? (
              <p>{props.messages[0]}</p>
            ) : (
              <ul className="list-disc space-y-1 pl-5">
                {props.messages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Alert;
