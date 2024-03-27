import { render } from '@testing-library/react';

import Button from '../button/button';

describe('Button', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Button text={''} />);
    expect(baseElement).toBeTruthy();
  });
});
