const githubQuery = (pageCount, queryString, paginationKeyword, paginationString) => {
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