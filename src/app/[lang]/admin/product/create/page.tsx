"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button, buttonVariants } from "~/components/ui/button";
import { createProduct } from "~/server/products/mutate";
import FormErrorMessage from "~/components/FormErrorMessage";
import { cn } from "~/libs/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  price: z.number().min(0),
  stock: z.number().min(0),
  description: z.string().min(10),
});

type ProductSchema = z.infer<typeof productSchema>;

type PageProps = {
  params: {
    lang: string;
  };
};

const Page = ({ params: { lang } }: PageProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductSchema) => {
    console.log(data);
    try {
      const response = await createProduct(data);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={"container mx-auto flex flex-col gap-4 p-8"}
    >
      <div className="flex items-center gap-4">
        <Link
          href={`/${lang}/product`}
          className={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "h-10 w-10 p-0",
          )}
        >
          <ArrowLeft width={20} height={20} />
        </Link>
        <h1 className={"py-4 text-2xl font-bold"}>Create new product</h1>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Product title</Label>
        <Input {...register("title")} />
        <FormErrorMessage errors={errors} name={"title"} />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Product Price</Label>
        <Input
          type={"number"}
          min={0}
          {...register("price", { valueAsNumber: true })}
        />
        <FormErrorMessage errors={errors} name={"price"} />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Product Stock</Label>
        <Input
          type={"number"}
          min={0}
          {...register("stock", { valueAsNumber: true })}
        />
        <FormErrorMessage errors={errors} name={"stock"} />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Product Description</Label>
        <Textarea rows={4} {...register("description")} />
        <FormErrorMessage errors={errors} name={"description"} />
      </div>

      <Button
        type={"submit"}
        className={"rounded bg-green-500 px-4 py-2 font-bold text-white"}
      >
        Submit
      </Button>
    </form>
  );
};

export default Page;
