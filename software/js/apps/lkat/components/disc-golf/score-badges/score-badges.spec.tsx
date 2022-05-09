import { render } from '@testing-library/react';

import ScoreBadges from './score-badges';

describe('ScoreBadges', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ScoreBadges />);
    expect(baseElement).toBeTruthy();
  });
});
