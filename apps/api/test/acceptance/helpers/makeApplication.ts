import pino from 'pino';
import DaoFactory from '../../../src/daoFactory';
import app from '../../../src/app';
import { Config } from '../../../config/environment';
import { UserRow } from '../../../src/daos/user';
import { PlayerRow } from '../../../src/daos/player';
import { UserSessionRow } from '../../../src/daos/userSession';
import deepmerge from 'deepmerge';

interface makeMockApplicationProps {
  config?: Partial<Config>;
  logger?: Partial<pino.Logger>;
  daoFactory?: Partial<DaoFactory>;
  authenticatedUser?: {
    user: Partial<UserRow>;
    session: Partial<UserSessionRow>;
  };
  authenticatedPlayer?: Partial<PlayerRow>;
}
/**
 * Create a mock application for testing with the ability to override the
 * config, logger and daoFactory.
 *
 * This function returns the application, logger and daoFactory so that they
 * can be used in tests.
 */
export default function makeApplication(
  options: makeMockApplicationProps = {},
) {
  const config = {
    jwtSecret: 'secret',
    webApp: {
      origin: 'http://localhost:3000',
    },
    ...options.config,
  } as Config;
  const logger = {
    child: () => logger,

    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    ...options.logger,
  } as unknown as pino.Logger;
  let daoFactory = deepmerge(
    {
      playerUnits: {
        fetchUnitsForPlayer: jest.fn().mockResolvedValue([]),
      },
      playerItems: {
        fetchItemsForPlayer: jest.fn().mockResolvedValue([]),
      },
    } as unknown as Partial<DaoFactory>,
    (options.daoFactory || {}) as Partial<DaoFactory>,
  ) as unknown as DaoFactory;
  if (options.authenticatedUser) {
    daoFactory = deepmerge(
      {
        userSession: {
          fetchValidByToken: jest
            .fn()
            .mockResolvedValue(options.authenticatedUser.session),
        },
        user: {
          fetchByID: jest
            .fn()
            .mockResolvedValue(options.authenticatedUser.user),
        },
      },
      daoFactory as Partial<DaoFactory>,
    ) as unknown as DaoFactory;
  }
  if (options.authenticatedPlayer) {
    daoFactory = deepmerge(
      {
        player: {
          fetchByID: jest.fn().mockResolvedValue(options.authenticatedPlayer),
          fetchBankHistory: jest.fn().mockResolvedValue([]),
          update: jest.fn().mockResolvedValue({}),
        },
        playerUnits: {
          fetchUnitsForPlayer: jest.fn().mockResolvedValue([]),
        },
      } as unknown as DaoFactory,
      daoFactory as Partial<DaoFactory>,
    );
  }

  return {
    application: app(logger, config, daoFactory),
    logger,
    daoFactory,
  };
}
