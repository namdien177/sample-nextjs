import { getListProduct } from "~/server/products/query";
import Image from "next/image";
import Link from "next/link";
import { cn } from "~/libs/utils";
import { buttonVariants } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { z, type ZodError } from "zod";
import { type PaginationParams } from "~/libs/typings/pagination";

type PageProps = {
  params: {
    lang: string;
  };
  searchParams: PaginationParams;
};

// searchParams schema
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});

const Page = async ({ params: { lang }, searchParams }: PageProps) => {
  let paginationParams: Required<PaginationParams> = {
    page: 1,
    limit: 10,
  };
  try {
    paginationParams = paginationSchema.parse(searchParams);
  } catch (error) {
    console.log(
      "params parse error",
      (error as ZodError<PaginationParams>).issues,
    );
  }
  const response = await getListProduct();

  return (
    <div className={"container relative mx-auto flex flex-col gap-4 p-8"}>
      <div className="flex items-center gap-4">
        <Link
          href={`/${lang}`}
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "h-10 w-10 p-0",
          )}
        >
          <ArrowLeft width={20} height={20} />
        </Link>
        <h1 className={"sticky top-0 bg-white py-4 text-2xl dark:bg-black"}>
          Products ({response.total} items)
        </h1>
        <div className="flex-1"></div>
        <Link
          href={`/${lang}/admin/product/create`}
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
          )}
        >
          Create
        </Link>
      </div>

      <hr />

      <div className="flex w-full flex-col gap-4">
        {response.products.map((product) => (
          <Link
            id={"product-item-" + product.id}
            href={{
              pathname: `/${lang}/product/${product.id}`,
            }}
            className={"flex w-full gap-4 rounded-lg border p-4"}
            key={product.id}
          >
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={200}
              height={200}
              className={"aspect-square h-40 w-40 rounded-lg object-cover"}
            />
            <div className="flex flex-1 flex-col gap-2">
              <h1 className={"text-lg font-bold"}>{product.title}</h1>
              <hr />
              <p>Price: {product.price}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className={"flex flex-row justify-center gap-4"}>
        {Number(paginationParams.page) > 1 && (
          <Link
            href={{
              pathname: "/product",
              query: {
                page: Number(paginationParams.page) - 1,
                limit: paginationParams.limit,
              },
            }}
            className={buttonVariants()}
          >
            Prev
          </Link>
        )}

        {paginationParams.page &&
          Number(paginationParams.page) * Number(paginationParams.limit) <
            response.total && (
            <Link
              href={{
                pathname: "/product",
                query: {
                  page: Number(paginationParams.page) + 1,
                  limit: paginationParams.limit,
                },
              }}
              className={buttonVariants()}
            >
              Next
            </Link>
          )}
      </div>
    </div>
  );
};

export default Page;
