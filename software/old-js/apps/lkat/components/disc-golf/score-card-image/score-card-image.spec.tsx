import { render } from '@testing-library/react';

import ScoreCardImage from './score-card-image';

describe('ScoreCardImage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ScoreCardImage />);
    expect(baseElement).toBeTruthy();
  });
});
