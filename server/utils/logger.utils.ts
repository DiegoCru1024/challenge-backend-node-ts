import { logger } from '../config/logger';

export const createModuleLogger = (module: string) => {
  return logger.child({ module });
};

export { logger };