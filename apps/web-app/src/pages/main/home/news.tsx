import SubNavigation from '../../../components/layout/subNavigation';
// import DarkThroneClient from '@darkthrone/client-library';
import { Pagination } from '@darkthrone/react-components';

import Markdown from 'react-markdown';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { NewsPost } from '@darkthrone/interfaces';
import { newsPosts } from '@darkthrone/shared-data';

// interface NewsPageProps {
//   client: DarkThroneClient;
// }
export default function NewsPage() {
  const { t } = useTranslation('home');
  const [searchParams, setSearchParams] = useSearchParams();

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1,
  );
  const [news, setNews] = useState<NewsPost[]>([]);

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams({ page: page.toString() });
      setCurrentPage(page);
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (currentPage < 1) {
      handlePageChange(1);
      return;
    }
    const items = newsPosts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
    if (items.length === 0) {
      handlePageChange(1);
      return;
    }
    setNews(items);
  }, [currentPage, handlePageChange]);

  return (
    <div>
      <SubNavigation />

      <div className="mb-10 flex flex-col gap-y-6">
        {news.length === 0 ? (
          <div className="text-center text-zinc-400 py-8">
            {t('news.emptyState')}
          </div>
        ) : null}
        {news.map((n, i) => (
          <div className="border border-zinc-700" key={i}>
            <div className="bg-zinc-800 font-display px-4 py-2 flex justify-between items-center">
              <div>{n.title}</div>
              <div className="text-sm font-sans text-zinc-300">
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: 'medium',
                }).format(n.date)}
              </div>
            </div>
            <div className="p-4 max-w-none prose prose-sm prose-p:mb-2 prose-zinc prose-invert">
              <Markdown>{n.content}</Markdown>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        onPageChange={handlePageChange}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={newsPosts.length}
      />
    </div>
  );
}
