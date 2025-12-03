import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddUserModal from '../src/components/settings/add-user-modal';

describe('Settings/AddUserModal', () => {
  it('opens modal, validates input and calls onAddUser then onCreated', async () => {
    const onAddUser = jest.fn().mockResolvedValue(undefined);
    const onCreated = jest.fn();

    render(<AddUserModal onAddUser={onAddUser} onCreated={onCreated} /> as any);

    // Trigger button should be present
    const trigger = screen.getByRole('button', { name: /add user/i });
    expect(trigger).toBeInTheDocument();

    await userEvent.click(trigger);

    // Fields should appear
    const firstName = await screen.findByLabelText(/first name/i);
    const lastName = screen.getByLabelText(/last name/i);
    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);

    // Fill fields with invalid email
    await userEvent.type(firstName, ' Alice ');
    await userEvent.type(lastName, ' Smith ');
    await userEvent.type(email, 'invalid-email');
    await userEvent.type(password, 'hunter2');

    const createBtn = screen.getByRole('button', { name: /create/i });
    await userEvent.click(createBtn);

    // Expect validation error
    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();

    // Fix email and submit
    await userEvent.clear(email);
    await userEvent.type(email, 'alice@example.com');
    await userEvent.click(createBtn);

    await waitFor(() => expect(onAddUser).toHaveBeenCalledTimes(1));
    expect(onAddUser).toHaveBeenCalledWith({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      password: 'hunter2',
    });

    await waitFor(() => expect(onCreated).toHaveBeenCalled());

    // After creation modal should be closed (title not present)
    await waitFor(() => expect(screen.queryByText(/add new user/i)).not.toBeInTheDocument());
  });

  it('shows error when no onAddUser provided', async () => {
    render(<AddUserModal /> as any);
    const trigger = screen.getByRole('button', { name: /add user/i });
    await userEvent.click(trigger);

    const firstName = await screen.findByLabelText(/first name/i);
    const lastName = screen.getByLabelText(/last name/i);
    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);

    await userEvent.type(firstName, 'Foo');
    await userEvent.type(lastName, 'Bar');
    await userEvent.type(email, 'foo@bar.com');
    await userEvent.type(password, 'pass');

    const createBtn = screen.getByRole('button', { name: /create/i });
    await userEvent.click(createBtn);

    expect(await screen.findByText(/add user function not provided/i)).toBeInTheDocument();
  });
});
