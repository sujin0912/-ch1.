export type IdpAuthenticatedUser = {
  id: string;
  sub: string;
  name: string;
  email: string;
};

export type IdpAuthenticatedRequest = {
  cookies?: Record<string, unknown>;

  headers: {
    authorization?: string;
  };

  user: IdpAuthenticatedUser;
};
