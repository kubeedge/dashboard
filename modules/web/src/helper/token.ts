export const getServiceAccountName = async (token: string) => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  // Decode the Base64 URL-encoded payload
  const payload = parts[1];
  const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

  // Extract the 'sub' field
  const sub = decodedPayload['kubernetes.io/serviceaccount/service-account.name'];

  // Make the default username as 'admin'
  return sub || 'admin';
};
