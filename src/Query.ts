import SearchInterface from "./types/Search";

const githubQuery = (search: SearchInterface) => {
  const pageCount = search.pageCount;
  const queryString = search.queryString;
  const paginationKeyword = search.paginationKeyword;
  const paginationString = search.paginationString;

  return {
      query: `
      {
        viewer {
          name
        }
        search(query: "${queryString} user:levijackson sort:updated-desc", type: REPOSITORY, ${paginationKeyword}: ${pageCount}, ${paginationString}) {
          repositoryCount,
          edges {
            cursor,
            node {
              ... on Repository {
                name,
                description,
                id,
                url,
                viewerSubscription
              }
            }
          },
          pageInfo {
            startCursor,
            hasNextPage,
            hasPreviousPage,
            endCursor
          }
        }
      }
  `
  }
};

export default githubQuery;