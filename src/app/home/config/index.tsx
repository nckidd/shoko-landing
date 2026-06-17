// Source - https://stackoverflow.com/a/44344023
// Posted by Fabian Schultz
// Retrieved 2026-04-13, License - CC BY-SA 3.0

const dev = process.env.NODE_ENV !== 'production';

export const server = dev ? 'http://localhost:3000' : 'https://shoko.netlify.com';
