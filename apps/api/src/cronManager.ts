import cron from 'node-cron';

export default () => {
  return {
    schedule(expression: string, task: () => void) {
      cron.schedule(expression, task);
    },

    start() {
      const tasks = cron.getTasks();
      tasks.forEach((task) => task.start());
    },
  };
};
