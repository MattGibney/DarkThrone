import { render } from '@testing-library/react';

import ReactComponents from './react-components';

describe('ReactComponents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactComponents />);
    expect(baseElement).toBeTruthy();
  });
});
