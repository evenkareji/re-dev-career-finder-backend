import algoliasearch from 'algoliasearch/lite';
import { format } from 'date-fns';
import { debounce } from 'debounce';
import Link from 'next/link';
import { ReactElement, ReactNode } from 'react';
import {
  Configure,
  Hits,
  HitsProps,
  InstantSearch,
  Pagination,
  SearchBox,
  SearchBoxProps,
  useInstantSearch,
} from 'react-instantsearch-hooks-web';
import { useAuthor } from '../features/hooks/useAuthor';
import { Post } from '../features/types/post';
import Layout from '../components/layout';
const searchClient = algoliasearch(
  '9NC2ACSGMS',
  'a0c919a9b685863fc45f07c6d6f51362',
);

const Hit: HitsProps<Post>['hitComponent'] = ({ hit }) => {
  console.log(hit.companyName, hit.authorId, 'hit');

  const author = useAuthor(hit.authorId);
  console.log(author, 'return author');

  return (
    <>
      <div className="border border-slate-500 p-4 w-44 rounded-sm">
        <Link href={hit.id}>
          <a>{hit.companyName}</a>
        </Link>
        <p> {format(hit.createdAt, 'yyyy年MM月dd日')}</p>
        <p>投稿者{author?.username}</p>
      </div>
    </>
  );
};
const NoResultsBoundary = ({ children }: { children: ReactNode }) => {
  const { results } = useInstantSearch();
  if (!results.__isArtificial && results.nbHits === 0) {
    return <p>{results.query}検索結果はありませんでした</p>;
  }
  return (
    <>
      {results.query && (
        <p>
          「{results.query}」の検索結果が{results.nbHits}件見つかりました
        </p>
      )}

      {children}
    </>
  );
};

const Search = () => {
  const search: SearchBoxProps['queryHook'] = (query, hook) => {
    hook(query);
  };
  return (
    <div>
      <h1>検索</h1>
      <InstantSearch indexName="posts" searchClient={searchClient}>
        <SearchBox queryHook={debounce(search, 500)} />
        <Configure hitsPerPage={2} />
        <NoResultsBoundary>
          <Hits<Post> hitComponent={Hit} />
          <Pagination classNames={{ list: 'flex space-x-3' }} />
        </NoResultsBoundary>
      </InstantSearch>
    </div>
  );
};

Search.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
export default Search;
