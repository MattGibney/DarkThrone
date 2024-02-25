import SubNavigation from '../../../components/layout/subNavigation';
import DarkThroneClient from '@darkthrone/client-library';
import Pagination from '../../../components/pagination';

import Markdown from 'react-markdown';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type NewsPost = {
  title: string;
  content: string;
  date: Date;
};

const newsPosts: NewsPost[] = [
  {
    title: 'Pre-Alpha Launch',
    content: `Hello, Welcome to DarkThrone Reborn!

I am very excited to launch this project into a pre-alpha stage. This is a very early stage of the project and there is still a lot of work to be done. I am looking forward to working with the community to make this game the best it can be.

This isn't the first time I set out to recreate DarkThrone. When the original game shut down it's servers I immediately started on a project called Dark Curse. The goal was to create an open source version of the game that the community could collaborate on together. I made several design decisions that I ultimately killed my enjoyment and stopped me from developing the project. Mostly this was around the tech stack I chose. I went for the absolute bare minimum with the goal of making it as accessible for new developers as possible to join in. This choice was ultimately a bad one however, development was slow and more painful than it needed to be.

I never really intended to pick this back up again. I had moved on to start a new company and that consumed all of my time. As that started to grow however, and as I began to bring on employees, I found myself finally having free time again. I tried picking up the Dark Curse project again however I very quickly hit the same hurdles that stopped me the first time. I decided to start over from scratch and this time I would make the game for myself. I would make the game that I wanted to play. I would make the game that I wanted to make.

I've been working on this in secret over the last few months. I didn't want to announce anything until there was something that prople could actually play. I can understand that it must be frustrating to know that something is potentially coming and then for it to never materialise. I wanted to make sure that I had something to show before I announced anything.

And with that, here we are. I hope you enjoy the game and I look forward to working with you all to make it the best it can be!

-Moppler
`,
    date: new Date('2024-02-22'),
  },
];

interface NewsPageProps {
  client: DarkThroneClient;
}
export default function NewsPage(props: NewsPageProps) {
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
            <Markdown className="p-4 max-w-none prose prose-sm prose-p:mb-2 prose-zinc prose-invert">
              {n.content}
            </Markdown>
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
