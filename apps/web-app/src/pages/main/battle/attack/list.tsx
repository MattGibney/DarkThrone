import DarkThroneClient from '@darkthrone/client-library';
import { useCallback } from 'react';
import { Avatar } from '@darkthrone/react-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SubNavigation from '../../../../components/layout/subNavigation';
import { PlayerObject } from '@darkthrone/interfaces';
import { Paginator } from '../../../../libs/pagination';
import Pagination from '../../../../components/pagination';
import { attackableMinLevel, attackableMaxLevel } from '@darkthrone/game-data';

interface AttackListPageProps {
  client: DarkThroneClient;
}
export default function AttackListPage(props: AttackListPageProps) {
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

  if (!players) {
    return null;
  }

  return (
    <main>
      <SubNavigation />
      <h2 className="text-lg font-semibold text-zinc-200 text-center">
        You may attack a player from levels {attackableMinLevel(playerLevel)} to{' '}
        {attackableMaxLevel(playerLevel)}.
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
                      Rank
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500"
                    >
                      Username
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-32"
                    >
                      Gold
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-32"
                    >
                      Army Size
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-20"
                    >
                      Level
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-zinc-800 text-zinc-400 border-b border-zinc-500 w-20"
                    >
                      Race
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, playerIdx) => (
                    <tr
                      key={playerIdx}
                      className={(() => {
                        if (player.id === playerID) {
                          return 'bg-zinc-400/50 cursor-pointer';
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
                        {new Intl.NumberFormat('en-GB').format(player.gold)}
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
