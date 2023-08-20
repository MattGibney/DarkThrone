import styles from './react-components.module.css';

/* eslint-disable-next-line */
export interface ReactComponentsProps {}

export function ReactComponents(props: ReactComponentsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ReactComponents!</h1>
    </div>
  );
}

export default ReactComponents;
