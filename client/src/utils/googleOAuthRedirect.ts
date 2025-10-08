const handleGoogleOAuthRedirect = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const client_id = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;
  const redirect_uri = `${process.env.NEXT_PUBLIC_API_URL}/users/google/callback`;

  if (!client_id || !redirect_uri) return;

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
  const params = new URLSearchParams({
    client_id,
    redirect_uri, // Your backend
    response_type: "code",
    scope: "email profile",
    access_type: "offline",
    prompt: "consent",
  });

  window.location.href = `${googleAuthUrl}?${params.toString()}`;
};

export { handleGoogleOAuthRedirect };
