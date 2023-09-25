import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { SWRConfig } from 'swr';
import { createServer } from '../../__test__/server';
import AuthButtons from './AuthButtons';

async function renderComponent() {
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );
  await screen.findAllByRole('link');
}

describe('when user is not signed in', () => {
  createServer([
    {
      path: '/api/user',
      res: () => {
        return {
          user: null,
        };
      },
    },
  ]);
  test('should show sign in & sign up buttons', async () => {
    await renderComponent();
    const signInButton = screen.getByRole('link', {
      name: /sign in/i
    });
    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute('href', '/signin');

    const signUpButton = screen.getByRole('link', {
      name: /sign up/i
    });
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute('href', '/signup');
  });

  test('should not show sign out button', async () => {
    await renderComponent();

    // Use queryByRole if need to check 
    // if element is not present in the DOM
    const signOutButton = screen.queryByRole('link', {
      name: /sign out/i
    });

    expect(signOutButton).not.toBeInTheDocument();
  });
});

describe('when user is signed in', () => {
  createServer([
    {
      path: '/api/user',
      res: () => {
        return {
          user: {
            id: 1,
            email: 'user@example.com',
          },
        };
      },
    },
  ]);
  test('should not show sign in & sign up buttons', async () => {
    await renderComponent();

    const signInButton = screen.queryByRole('link', {
      name: /sign in/i
    });
    const signUpButton = screen.queryByRole('link', {
      name: /sign up/i
    });

    expect(signInButton).not.toBeInTheDocument();
    expect(signUpButton).not.toBeInTheDocument();
  });

  test('should show sign out button', async () => {
    await renderComponent();

    const signOutButton = screen.queryByRole('link', {
      name: /sign out/i
    });

    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton).toHaveAttribute('href', '/signout');
  });
});
