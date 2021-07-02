import github from "./config/db";
import query from "./Query";
import { useEffect, useState, useCallback, useRef } from "react";
import RepoInfo from "./RepoInfo";
import SearchBox from "./SearchBox";
import NavButtons from "./NavButtons";
import SearchInterface from "./types/Search";
import RepoInterface from "./types/Repo";

interface RepoResult {
  node: RepoInterface
}

function App() {
  const DEFAULT_STATE: SearchInterface = {
    pageCount: 5,
    queryString: "",
    startCursor: null,
    endCursor: null,
    hasPreviousPage: false,
    hasNextPage: false,
    paginationKeyword: "first",
    paginationString: ""
  };

  let [userName, setUserName] = useState("");
  let [repoList, setRepoList] = useState([]);
  let [totalCount, setTotalCount] = useState(0);

  let [search, setSearch] = useState(DEFAULT_STATE);

  const updateSearch = (prop: string, value: any) => {
    setSearch({...search, [prop]: value });
  };

  const apiSearchRef = useRef<number|null>(null);

  const fetchData = useCallback( () => {
    if (search === DEFAULT_STATE) {
      return;
    }

    if (apiSearchRef.current) {
      clearTimeout(apiSearchRef.current);
    }
    apiSearchRef.current = window.setTimeout(() => {
      const queryText = JSON.stringify(query(search));

      fetch(github.baseUrl, {
        method: "POST",
        headers: github.headers,
        body: queryText
      })
      .then(response => response.json())
      .then(data => {
        const viewer = data.data.viewer;
        const repos = data.data.search.edges;
        const total = data.data.search.repositoryCount;
        const start = data.data.search.pageInfo?.startCursor;
        const end = data.data.search.pageInfo?.endCursor;
        const next = data.data.search.pageInfo?.hasNextPage;
        const prev = data.data.search.pageInfo?.hasPreviousPage;

        setUserName(viewer.name);
        setRepoList(repos);
        setTotalCount(total);

        updateSearch('startCursor', start);
        updateSearch('endCursor', end);
        updateSearch('hasPreviousPage', next);
        updateSearch('hasNextPage', prev);
      })
      .catch( error => {
        console.log(error);
      })
    }, 300);
  }, [search.pageCount, search.queryString, search.paginationString, search.paginationKeyword]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container mt-5">
      <h1 className="text-primary"><i className="bi bi-diagram-2-fill"></i> Public repos from {userName}</h1>
      <SearchBox
        totalCount={totalCount}
        pageCount={search.pageCount}
        queryString={search.queryString}
        onQueryChange={(query: string) => {updateSearch('queryString', query)}}
        onTotalChange={(perPage: number) => {updateSearch('pageCount', perPage)}}
      />
      <NavButtons
        start={search.startCursor}
        end={search.endCursor}
        next={search.hasNextPage}
        previous={search.hasPreviousPage}
        onPage={(myKeyword: string, myString: string) => {
          updateSearch('paginationKeyword', myKeyword);
          updateSearch('paginationString', myString);
        }}
      />

      { repoList && (
        <ul className="list-group list-group-flush">
          {
            repoList.map((repo: RepoResult) => (
              <RepoInfo key={repo.node.id} repo={repo.node} />
            ))
          }
        </ul>  
      )
      }
    </div>
  );
}

export default App;
