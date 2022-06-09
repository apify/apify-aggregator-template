import { ApifyClient } from 'apify-client';
import React, { useCallback, useEffect, useState } from 'react';

const client = new ApifyClient();

interface Article {
  url: string;
  title: string;
  description: string;
  loadedDomain: string;
  image: string;
  date: string;
}
// TODO: Polish this stuff
const useArticles = (datasetId: string, pageSize: number) => {
  const [page, setPage] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  // This is a hack to make reloads  work nice locally
  const [lastLoadedPage, setLastLoadedPage] = useState(-1);

  const fetchNextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  useEffect(() => {
    const getNewData = async () => {
      const limit = pageSize;
      const offset = pageSize * page;
      setIsLoading(true);
      const { items, total } = await client.dataset(datasetId).listItems({
        desc: true,
        fields: [
          'url',
          'title',
          'description',
          'image',
          'date',
          'loadedDomain',
        ],
        limit,
        offset,
      });
      setIsLoading(false);
      setLastLoadedPage(page);
      setArticles((data) => [...data, ...(items as unknown as Article[])]);
      setHasMore(total >= offset + pageSize);
    };

    if (page === lastLoadedPage) return;
    getNewData();
  }, [datasetId, page, pageSize, lastLoadedPage]);
  return { articles, isLoading, hasMore, fetchNextPage };
};

const ArticleBlock = ({ article }: { article: Article }) => (
  <a
    className="xs:w-1/3 flex w-full grow flex-col justify-between border border-neutral-200 shadow-lg transition hover:border-b hover:border-neutral-300 hover:shadow-2xl sm:w-1/2 md:w-1/4"
    href={article.url}
    target="_blank"
    rel="noreferrer"
  >
    <div className="p-3 pb-0 text-xs">
      {`${new Date(article.date).toLocaleDateString()} - ${
        article.loadedDomain
      }`}
    </div>
    <div className="grow p-3 text-sm underline">{article.title}</div>
    <img src={article.image} alt={article.title} />
  </a>
);

export const Feed = ({ datasetId }: { datasetId: string }) => {
  const { articles, hasMore, isLoading, fetchNextPage } = useArticles(
    datasetId,
    9
  );
  return (
    <>
      <div className="flex flex-wrap gap-6">
        {articles.map((article) => (
          <ArticleBlock key={article.url} article={article} />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={fetchNextPage}
          disabled={isLoading}
          className="my-8 rounded-md border border-neutral-200 px-4"
        >
          More...
        </button>
      )}
    </>
  );
};
