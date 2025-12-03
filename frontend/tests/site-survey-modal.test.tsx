import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SiteSurveyModal from '../src/components/dashboard/site-survey-modal';

describe('Dashboard/SiteSurveyModal', () => {
  it('opens modal, fills selects and submits', async () => {
    render(<SiteSurveyModal /> as any);
    const trigger = screen.getByRole('button', { name: /site survey/i });
    await userEvent.click(trigger);

    // Selects should be present
    const appearance = await screen.findByLabelText(/appearance/i);
    await userEvent.click(appearance);
    await userEvent.click(screen.getByText(/excellent/i));

    const navigation = screen.getByLabelText(/navigation/i);
    await userEvent.click(navigation);
    await userEvent.click(screen.getByText(/good/i));

    const ease = screen.getByLabelText(/ease-of-use/i);
    await userEvent.click(ease);
    await userEvent.click(screen.getByText(/fair/i));

    const recommend = screen.getByLabelText(/would you recommend this site to a friend\?/i);
    await userEvent.click(recommend);
    await userEvent.click(screen.getByText(/yes/i));

    const submit = screen.getByRole('button', { name: /submit survey/i });
    expect(submit).not.toBeDisabled();
    await userEvent.click(submit);

    // After submit modal should close; the modal heading should no longer be present
    expect(screen.queryByRole('heading', { name: /site survey/i })).not.toBeInTheDocument();
  });
});
