"use server";
import type Product from "~/libs/model/product";
import getKyServer from "~/libs/ky/ky.server";

export const createProduct = async (data: Partial<Product>) => {
  const ky = await getKyServer();
  return ky.post("products/add", { json: data }).json<Product>();
};
