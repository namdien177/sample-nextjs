export type PaginationParams = {
  page?: string | number;
  limit?: string | number;
};

export type PaginationMeta = {
  total: number;
  skip: number;
  limit: number;
};
