import {
  type Dispatch,
  type ReactNode,
  createContext,
  useContext,
  useState,
  useReducer,
} from "react";

interface IAction {
  type: "modify";
  payload: IFormData;
}

interface IFormData {}

interface IFormContext {
  setPrevStep: (value: string) => void;
  handleNext: (value?: string) => void;
  dispatch: Dispatch<IAction>;
  step: string;
  prevStep: string;
  data: IFormData;
}

const formState = createContext<IFormContext>({
  handleNext: (value: string) => {},
  setPrevStep: (value: string) => {},
  step: "first",
  prevStep: "first",
  data: {
    category: -1,
    subCategory: "",
    state: -1,
    city: "",
    imgs: [{ value: undefined }],
    desc: "",
    userName: "",
    phone: "0",
    price: 0,
    negotiable: "",
  },
  dispatch: (value: {}) => {},
});

export const FormContext = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState("first");
  const [prevStep, setPrevStep] = useState("first");
  const [data, dispatch] = useReducer(reducer, {
    category: -1,
    subCategory: "",
    state: -1,
    city: "",
    imgs: [{ value: undefined }],
    desc: "",
    userName: "",
    phone: "0",
    price: 0,
    negotiable: "",
  });
  function reducer(data: IFormData, action: IAction) {
    const { type } = action;
    switch (type) {
      case "modify": {
        return { ...action.payload };
      }
      default:
        return data;
    }
  }

  function handleNext(value: string = prevStep) {
    setStep(value);
  }
  console.log({ data });

  return (
    <formState.Provider
      value={{
        step,
        handleNext,
        data,
        dispatch,
        prevStep,
        setPrevStep,
      }}
    >
      {children}
    </formState.Provider>
  );
};

export function useFormState() {
  return useContext(formState);
}
