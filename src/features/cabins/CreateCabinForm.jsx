import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import SpinnerMini from "../../ui/SpinnerMini";

import { useCreateCabin } from "./useCreateCabin";

function CreateCabinForm({ onCloseModal }) {
  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { errors } = formState;
  const { isCreating, createMutate } = useCreateCabin();

  function onSubmit(data) {
    createMutate(
      {
        ...data,
        image: data.image[0],
      },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      }
    );
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cabin details" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          {...register("name", { required: "This field is required" })}
          error={errors?.name?.message}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "This field is required",
            valueAsNumber: true,
            min: {
              value: 1,
              message: "Capacity must be at least 1",
            },
          })}
          error={errors?.maxCapacity?.message}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "This field is required",
            valueAsNumber: true,
            min: {
              value: 1,
              message: "Price must be at least 1",
            },
          })}
          error={errors?.regularPrice?.message}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            validate: {
              lessThanPrice: (value) =>
                Number(value) <= Number(getValues().regularPrice) ||
                "Discount must be less than the regular price",
              positive: (value) =>
                Number(value) >= 0 || "Discount cannot be negative",
            },
          })}
          error={errors?.discount?.message}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          {...register("description", { required: "This field is required" })}
          error={errors?.description?.message}
        />
      </FormRow>

      <FormRow label="Cabin photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", { required: "This field is required" })}
          error={errors?.image?.message}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button
          disabled={isCreating}
          className="display: flex; align-items: center; gap: 0.4rem;"
        >
          {isCreating ? (
            <>
              <SpinnerMini /> Adding cabin...
            </>
          ) : (
            "Add cabin"
          )}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
