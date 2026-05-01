export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scopes: string;
  authUrl: string;
}

export const oauthConfigs = {
  notion: {
    clientId: 'your-notion-client-id',
    redirectUri: `${window.location.origin}/auth/notion/callback`,
    scopes: 'read:content',
    authUrl: 'https://api.notion.com/v1/oauth/authorize?owner=user',
  },
  confluence: {
    clientId: 'your-confluence-client-id',
    redirectUri: `${window.location.origin}/auth/confluence/callback`,
    scopes: 'read:confluence-content.all',
    authUrl: 'https://auth.atlassian.com/authorize',
  },
} as const;

export function generateAuthUrl(provider: keyof typeof oauthConfigs): string {
  const config = oauthConfigs[provider];
  
  const params = new URLSearchParams();
  
  if (provider === 'confluence') {
    // Atlassian OAuth requires specific parameters
    params.set('audience', 'api.atlassian.com');
    params.set('client_id', config.clientId);
    params.set('scope', config.scopes);
    params.set('redirect_uri', config.redirectUri);
    params.set('state', 'secure-random-' + Math.random().toString(36).substring(7));
    params.set('response_type', 'code');
    params.set('prompt', 'consent');
  } else {
    // Standard OAuth parameters for Notion
    params.set('client_id', config.clientId);
    params.set('redirect_uri', config.redirectUri);
    params.set('scope', config.scopes);
    params.set('response_type', 'code');
    params.set('access_type', 'offline');
    params.set('prompt', 'consent');
  }

  return `${config.authUrl}?${params.toString()}`;
}

export function openOAuthWindow(provider: keyof typeof oauthConfigs): Promise<string> {
  return new Promise((resolve, reject) => {
    const authUrl = generateAuthUrl(provider);
    
    // Open OAuth in new window to avoid iframe restrictions
    const authWindow = window.open(
      authUrl,
      'oauth-window',
      'width=600,height=700,scrollbars=yes,resizable=yes,left=' + 
      (window.screen.width / 2 - 300) + ',top=' + 
      (window.screen.height / 2 - 350)
    );
    
    if (!authWindow) {
      reject(new Error('Failed to open OAuth window. Please allow popups.'));
      return;
    }
    
    // Listen for window close or message
    const checkClosed = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(checkClosed);
        // In a real implementation, you'd get the code from the callback
        resolve('mock-auth-code-' + Date.now());
      }
    }, 1000);
    
    // Timeout after 5 minutes
    setTimeout(() => {
      clearInterval(checkClosed);
      if (!authWindow.closed) {
        authWindow.close();
      }
      reject(new Error('OAuth timeout'));
    }, 5 * 60 * 1000);
  });
}
export async function exchangeCodeForToken(provider: keyof typeof oauthConfigs, code: string) {
  // This would typically be handled by your backend
  // Here's the structure for the token exchange request
  
  const tokenUrls = {
    notion: 'https://api.notion.com/v1/oauth/token',
    confluence: 'https://auth.atlassian.com/oauth/token',
  };

  const response = await fetch(`/api/oauth/${provider}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      redirect_uri: oauthConfigs[provider].redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  return response.json();
}