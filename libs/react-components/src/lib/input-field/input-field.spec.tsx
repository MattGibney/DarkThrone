import { render } from '@testing-library/react';

import InputField from './input-field';

describe('InputField', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <InputField value={''} setValue={() => null} />,
    );
    expect(baseElement).toBeTruthy();
  });
});
