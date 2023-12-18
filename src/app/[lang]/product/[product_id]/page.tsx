import { getProductDetail } from "~/server/products/query";
import Image from "next/image";
import { buttonVariants } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "~/libs/utils";

type PageProps = {
  params: {
    lang: string;
    product_id: string;
  };
  searchParams: {
    from?: string;
  };
};

const Page = async ({
  params: { product_id, lang },
  searchParams: { from },
}: PageProps) => {
  const product = await getProductDetail(product_id);
  return (
    <div className={"container relative mx-auto flex flex-col p-8"}>
      <div
        className={
          "sticky top-0 flex items-center gap-4 bg-white py-4 text-2xl font-bold dark:bg-black"
        }
      >
        <Link
          href={from ? from : `/${lang}/product`}
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "h-10 w-10 p-0",
          )}
        >
          <ArrowLeft width={20} height={20} />
        </Link>
        <span>Product detail</span>
      </div>
      <hr className={"my-8"} />

      <div className="flex flex-col gap-4 md:flex-row">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={200}
          height={200}
          className={"h-64 w-64 object-cover object-center"}
        />

        <div className="flex flex-1 flex-col gap-4">
          <h1 className={"text-lg font-bold"}>{product.title}</h1>
          <hr />
          <p>Price: {product.price}</p>
          {product.description}
        </div>
      </div>
    </div>
  );
};

export default Page;
