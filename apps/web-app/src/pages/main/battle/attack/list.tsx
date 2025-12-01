import DarkThroneClient from '@darkthrone/client-library';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@darkthrone/react-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SubNavigation from '../../../../components/layout/subNavigation';
import { PlayerObject } from '@darkthrone/interfaces';
import { Paginator } from '../../../../libs/pagination';
import { Pagination } from '@darkthrone/react-components';
import { attackableMinLevel, attackableMaxLevel } from '@darkthrone/game-data';

interface AttackListPageProps {
  client: DarkThroneClient;
}
export default function AttackListPage(props: AttackListPageProps) {
  const { t } = useTranslation(['battle', 'common']);
  const navigate = useNavigate();

  const playerID = props.client.authenticatedPlayer?.id;
  const playerLevel = props.client.authenticatedPlayer?.level;
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get('page');
  const currentPageNumber = pageParam ? Math.max(1, parseInt(pageParam)) : 1;
  const pageSize = 100;

  const fetchForPage = useCallback(
    async (pageNumber: number) => {
      const fetched = await props.client.players.fetchAllPlayers(
        pageNumber,
        pageSize,
      );

      if (fetched.status === 'fail') {
        return;
      }

      return {
        items: fetched.data.items,
        meta: fetched.data.meta,
      };
    },
    [props.client.players],
  );

  const {
    setPage,
    totalItems,
    data: players,
  } = Paginator<PlayerObject>({
    paginationRoute: '/attack',
    navigate,
    currentPageNumber,
    fetchForPage,
  });

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams({ page: page.toString() });
      setPage(page);
    },
    [setPage, setSearchParams],
  );

  if (!players || !playerID || !playerLevel) {
    return null;
  }

  return (
    <main>
      <SubNavigation />
      <h2 className="text-base font-semibold text-zinc-300 text-center">
        {t('battle:attack.list.range', {
          min: attackableMinLevel(playerLevel),
          max: attackableMaxLevel(playerLevel),
        })}
      </h2>
      <div className="sm:px-6 lg:px-8">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full sm:py-2 align-middle">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-16"
                    >
                      {t('battle:attack.list.headers.rank')}
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500"
                    >
                      {t('battle:attack.list.headers.username')}
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-6 sm:w-32"
                    >
                      {t('common:resources.gold')}
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-32"
                    >
                      {t('battle:attack.list.headers.armySize')}
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-20"
                    >
                      {t('common:resources.level')}
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-20"
                    >
                      {t('battle:attack.list.headers.race')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, playerIdx) => (
                    <tr
                      key={playerIdx}
                      className={(() => {
                        if (player.id === playerID) {
                          return 'bg-yellow-300/10 cursor-pointer';
                        }
                        return 'even:bg-zinc-800/50 cursor-pointer';
                      })()}
                      onClick={() => {
                        navigate(`/player/${player.id}`);
                      }}
                    >
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                        {player.overallRank}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                        {player.name}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                        <span className="block sm:hidden">
                          {new Intl.NumberFormat('en-GB', {
                            notation: 'compact',
                          }).format(player.gold)}
                        </span>
                        <span className="hidden sm:block">
                          {new Intl.NumberFormat('en-GB').format(player.gold)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                        {new Intl.NumberFormat('en-GB').format(player.armySize)}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                        {player.level}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-zinc-300">
                        <Avatar race={player.race} size="small" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Pagination
        onPageChange={handlePageChange}
        currentPage={currentPageNumber}
        itemsPerPage={pageSize}
        totalItems={totalItems}
      />
    </main>
  );
}
