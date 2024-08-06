import { classNames } from '../src/utils';

describe('Utils', () => {
  describe('classNames', () => {
    it('should return a string with all the classes', () => {
      const classes = 'class1 class2 class3';
      const result = classNames('class1', 'class2', 'class3');
      expect(result).toBe(classes);
    });

    it('should return a string with only the truthy classes', () => {
      const classes = 'class1 class3';
      const result = classNames('class1', '', 'class3', '');
      expect(result).toBe(classes);
    });
  });
});
