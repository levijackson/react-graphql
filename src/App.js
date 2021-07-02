import github from "./db.js";
import query from "./Query.js";
import { useEffect, useState, useCallback } from "react";
import RepoInfo from "./RepoInfo.js";
import SearchBox from "./SearchBox.js";
import NavButtons from "./NavButtons.js";

function App() {
  let [userName, setUserName] = useState("");
  let [repoList, setRepoList] = useState(null);
  let [pageCount, setPageCount] = useState(10);
  let [queryString, setQueryString] = useState("");
  let [totalCount, setTotalCount] = useState(null);

  let [startCursor, setStartCursor] = useState(null);
  let [endCursor, setEndCursor] = useState(null);
  let [hasPreviousPage, setHasPreviousPage] = useState(false);
  let [hasNextPage, setHasNextPage] = useState(true);
  let [paginationKeyword, setPaginationKeyword] = useState("first");
  let [paginationString, setPaginationString] = useState("");

  const fetchData = useCallback( () => {
    const queryText = JSON.stringify(query(pageCount, queryString, paginationKeyword, paginationString));

    fetch(github.baseUrl, {
      method: "POST",
      headers: github.headers,
      body: queryText
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);

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
      setStartCursor(start);
      setEndCursor(end);
      setHasNextPage(next);
      setHasPreviousPage(prev);
    })
    .catch( error => {
      console.log(error);
    })
  }, [pageCount, queryString, paginationString, paginationKeyword]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container mt-5">
      <h1 className="text-primary"><i className="bi bi-diagram-2-fill"></i> Repos from {userName}</h1>
      <SearchBox
        totalCount={totalCount}
        pageCount={pageCount}
        queryString={queryString}
        onQueryChange={(myString) => {setQueryString(myString)}}
        onTotalChange={(total) => {setPageCount(total)}}
      />
      <NavButtons
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        previous={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString);
        }}
      />

      { repoList && (
        <ul className="list-group list-group-flush">
          {
            repoList.map((repo) => (
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
