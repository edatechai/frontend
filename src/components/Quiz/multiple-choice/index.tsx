import { FormContext } from "@/components/productInputs/FormContext";
import { FormStep } from "@/components/productInputs/FormStep";

const AddNewProduct = () => {
  return (
    <div className="min-h-[75vh] bg-white rounded-lg shadow-md text-black text-center py-12 my-8 px-3 m-3 flex items-center md:mx-14 md:px-16 lg:mx-32">
      <div className="flex gap-11 flex-col w-full">
        <FormContext>
          <FormStep />
        </FormContext>
      </div>
    </div>
  );
};

export default AddNewProduct;
