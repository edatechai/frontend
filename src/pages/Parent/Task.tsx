import { useGetChildResultQuery } from "@/features/api/apiSlice";
import { useParams } from "react-router-dom";
import Classrooms from "./Classrooms"

const Task = () => {
  const { childId } = useParams();
  const { data, isLoading } = useGetChildResultQuery(childId);

  console.log(childId);

  return <Classrooms childId={childId} data={data} />;
};

export default Task;
