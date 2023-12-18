import { getListProduct } from "~/server/products/query";
import Image from "next/image";
import Link from "next/link";
import { cn } from "~/libs/utils";
import { buttonVariants } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";

type PageProps = {
  params: {
    lang: string;
  };
  searchParams: {
    page: number;
  };
};

const Page = async ({ params: { lang } }: PageProps) => {
  const { products, limit, total, skip } = await getListProduct();

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
          Products ({total} items)
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
        {products.map((product) => (
          <Link
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
    </div>
  );
};

export default Page;
