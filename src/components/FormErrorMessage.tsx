"use client";

import {
  ErrorMessage,
  type FieldValuesFromFieldErrors,
} from "@hookform/error-message";
import {
  type FieldErrors,
  type FieldName,
  type FieldValues,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  errors: FieldErrors<T>;
  name: FieldName<FieldValuesFromFieldErrors<FieldErrors<T>>>;
};

const FormErrorMessage = <T extends FieldValues>({
  errors,
  name,
}: Props<T>) => {
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => <p className={"text-red-500"}>{message}</p>}
    />
  );
};

export default FormErrorMessage;
