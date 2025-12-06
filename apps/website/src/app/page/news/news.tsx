import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../../components/layout/pageHeader';
import { useCallback, useEffect, useState } from 'react';
import { NewsPost } from '@darkthrone/interfaces';
import { newsPosts } from '@darkthrone/shared-data';
import Markdown from 'react-markdown';
import { Pagination } from '@darkthrone/react-components';

export default function NewsPage() {
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
      <PageHeader text="News" />

      <div className="bg-zinc-800 text-zinc-200">
        <div className="max-w-screen-lg mx-auto py-10 mb-10 flex flex-col gap-y-6">
          {news.map((n, i) => (
            <div className="border border-zinc-700 rounded-lg" key={i}>
              <div className="bg-zinc-900 font-display rounded-t-lg px-4 py-2 flex justify-between items-center">
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
          <Pagination
            onPageChange={handlePageChange}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={newsPosts.length}
          />
        </div>
      </div>
    </div>
  );
}
