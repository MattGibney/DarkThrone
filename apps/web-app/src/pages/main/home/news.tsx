// import DarkThroneClient from '@darkthrone/client-library';
import { Pagination } from '@darkthrone/shadcnui/components/pagination';
import { Badge } from '@darkthrone/shadcnui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@darkthrone/shadcnui/card';
import { Separator } from '@darkthrone/shadcnui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@darkthrone/shadcnui/tooltip';
import Markdown from 'react-markdown';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NewsPost } from '@darkthrone/interfaces';
import { newsPosts } from '@darkthrone/shared-data';

// interface NewsPageProps {
//   client: DarkThroneClient;
// }
export default function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1,
  );
  const [news, setNews] = useState<NewsPost[]>([]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(newsPosts.length / itemsPerPage)),
    [itemsPerPage],
  );

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
    <main className="grid gap-6 mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-card-foreground">
            DarkThrone Reborn News
          </CardTitle>
          <CardDescription className="text-card-foreground/70">
            Announcements, patch notes, and game updates.
          </CardDescription>
          <CardAction>
            <Badge variant={'outline'} className="py-3 px-4">
              Page {currentPage} of {totalPages}
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <div className="flex flex-col gap-6">
        {news.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-card-foreground/70">
              No news posts available yet.
            </CardContent>
          </Card>
        ) : (
          news.map((n, i) => (
            <Card key={`${n.title}-${i}`}>
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground">
                  {n.title}
                </CardTitle>
                <CardDescription className="text-card-foreground/70">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-default">
                        {new Intl.DateTimeFormat(undefined, {
                          dateStyle: 'medium',
                        }).format(n.date)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={6}>
                      {new Intl.DateTimeFormat(undefined, {
                        dateStyle: 'full',
                        timeStyle: 'short',
                      }).format(n.date)}
                    </TooltipContent>
                  </Tooltip>
                </CardDescription>
                <CardAction>
                  <Badge variant={'secondary'}>Update</Badge>
                </CardAction>
              </CardHeader>
              <Separator />
              <CardContent className="prose prose-invert prose-sm max-w-none">
                <Markdown>{n.content}</Markdown>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Pagination
        onPageChange={handlePageChange}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={newsPosts.length}
      />
    </main>
  );
}
