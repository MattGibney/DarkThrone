/* eslint-disable-next-line */
export interface AvatarProps {
  url?: string;
}

export function Avatar(props: AvatarProps) {
  if (!props.url) {
    return (
      <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-700">
        <svg className="h-full w-full text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </span>
    );
  }

  return <img className="h-12 w-12 flex-none rounded-full bg-gray-600" src={props.url} alt='' />;
}

export default Avatar;
