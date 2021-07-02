interface Search {
  pageCount: number,
  queryString: string,
  startCursor: string|null,
  endCursor: string|null,
  hasPreviousPage: boolean|null,
  hasNextPage: boolean|null,
  paginationKeyword: string|null,
  paginationString: string|null
}

export default Search;