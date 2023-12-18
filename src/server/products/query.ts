import getKyServer from "~/libs/ky/ky.server";
import type Product from "~/libs/model/product";
import { type PaginationMeta } from "~/libs/typings/pagination";

type PaginationParams = {
  page: number;
  limit: number;
};

export const getListProduct = async (queryOptions?: PaginationParams) => {
  let queryPage = queryOptions?.page ?? 1;
  let limit = queryOptions?.limit ?? 10;
  if (queryPage < 1) {
    queryPage = 1;
  }
  if (limit < 1) {
    limit = 10;
  }
  const skip = (queryPage - 1) * limit;

  const ky = await getKyServer();
  return await ky
    .get("products", {
      searchParams: {
        limit,
        skip,
      },
    })
    .json<
      {
        products: Product[];
      } & PaginationMeta
    >();
};

export const getProductDetail = async (id: string) => {
  const ky = await getKyServer();
  const response = await ky.get(`products/${id}`).json<Product>();
  return response;
};
