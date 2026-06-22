import logger from 'jet-logger';

import EnvVars from './common/constants/env';
import server from './server';

const SERVER_START_MESSAGE =
  'Servidor iniciando na porta ' + EnvVars.Port.toString();

server.listen(EnvVars.Port, (err) => {
  if (!!err) {
    logger.err(err.message);
  } else {
    logger.info(SERVER_START_MESSAGE);
  }
});
