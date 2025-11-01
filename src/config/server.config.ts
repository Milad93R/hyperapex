export const SERVER_CONFIG = {
  dev: process.env.NODE_ENV !== 'production',
  hostname: process.env.NODE_ENV === 'production' 
    ? (process.env.HOSTNAME || 'localhost')
    : 'localhost', // Always use localhost in development
  port: parseInt(process.env.PORT || '3168', 10),
} as const;

export const getServerUrl = () => {
  const { hostname, port } = SERVER_CONFIG;
  return `http://${hostname}:${port}`;
};
