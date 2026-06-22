import jetPaths from 'jet-paths';

const Paths = {
  _: '/api'
} as const;

export const JetPaths = jetPaths(Paths);
export default Paths;
