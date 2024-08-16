import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetStrengthsAndweaknessesMutation } from "../../features/api/apiSlice";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const StrengthsAndweaknesses = (props) => {
  const userInfo = useSelector((state) => state?.user.userInfo);
  const [classId, setClassId] = useState("");
  const [objCode, setObjCode] = useState("");
  const [accountId, setAccountId] = useState(userInfo?.accountId);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [getSW, { data, isLoading, isError, isSuccess }] =
    useGetStrengthsAndweaknessesMutation();
  const [realData, setRealData] = useState();

  console.log("this is data", realData);

  useEffect(() => {
    function getCategoryAndTopic(objCode, props) {
      const result = props?.quizResult?.data?.find(
        (result) => result.objCode === objCode
      );
      if (result) {
        setTopic(result.topic);
        setCategory(result.category);
      }
    }

    if (objCode) {
      getCategoryAndTopic(objCode, props);
    }
  }, [objCode, props]);

  const handleSw = async () => {
    const payload = {
      classId,
      objCode,
      accountId,
      topic,
      category,
      userId: userInfo?._id,
    };
    console.log(payload);

    const result = await getSW(payload);
    // console.log("this is my result", result)
    setRealData(result);
  };

  //console.log("here me",realData.data.aggData.chartData)

  const chartData = realData?.data?.getAggregateScores?.data;
  console.log("new", chartData);

  // const newdata = [
  //   { name: 'Class',  score : chartData?.classScores.classScore },
  //   { name: 'Student', score : chartData?.studentScores.studentScore },
  //   { name: 'Country', score : chartData?.countryScores.countryScore }
  // ];

  // const newdata = [
  //   { name: `${userInfo?.fullName}`, sales: chartData?.studentScores.studentScore },
  //   { name: `Class Ave`, sales: chartData?.classScores.classScore},
  //   { name: `Country Ave`, sales: chartData?.countryScores.countryScore},

  // ];

  const newdata = [
    {
      name: "Number and Numeration",
      student: 50,
      class: 50,
      country: 50,
    },
  ];

  return (
    <div className="flex flex-row">
      <div className="min-w-[50%] max-w-[50%]">
        {/* Open the modal using document.getElementById('ID').showModal() method */}

        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Let's Analyse your strengths and weeknesses
            </h3>
            <div>
              <select
                //   disabled={isLoading}
                onChange={(e) => setClassId(e.target.value)}
                className="select select-bordered w-full mt-3"
              >
                <option disabled selected>
                  Select your classroom
                </option>
                {props?.myClasses?.classes?.map((i, index) => (
                  // <option key={index} value={classItem}>{classItem}</option>
                  <option value={i._id} key={index}>
                    {i?.classTitle}
                  </option>
                ))}
              </select>

              {/* <select 
//   disabled={isLoading} 
  onChange={(e) => setObjCode(e.target.value)} className="select select-bordered w-full mt-3">
    <option disabled selected>Select a topic</option>
    {props?.quizResult?.data?.map((i, index) => (
        // <option key={index} value={classItem}>{classItem}</option>
        <option value={i.objCode} key={index}>{i?.topic}</option>
    ))}
</select> */}
            </div>

            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button onClick={handleSw} className="btn">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </dialog>

        <div className="flex justify-between items-center">
          <div className="font-medium text-[25px] mb-5">
            Mathematics Jss 1 A
          </div>
          <button
            onClick={() => document.getElementById("my_modal_5").showModal()}
            className="btn bg-blue-500 text-white mb-5"
          >
            Analyse your strengths and weeknesses
          </button>
        </div>
        <div>
          <div>
            <div className="collapse collapse-plus bg-white">
              <input type="radio" name="my-accordion-3" defaultChecked />
              <div className="collapse-title  font-medium text-green-600">
                Strengths
              </div>
              <div className="collapse-content">
                <ul tabIndex={0} className="  z-[1] w-full">
                  {realData?.data?.SW?.strengths?.map((i, index) => {
                    return (
                      <li key={index} className=" mt-5 mb-5">
                        <a> Topic: {i?.objective_name}</a>
                        <br />
                        <a> Score: {i?.score}</a>
                        <br />
                        <a>National Ranking: {i?.national_percentile_rank}</a>
                        <br />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="collapse collapse-plus bg-white mt-5">
              <input type="radio" name="my-accordion-3" defaultChecked />
              <div className="collapse-title  font-medium text-red-500">
                Weaknesses
              </div>
              <div className="collapse-content">
                <ul tabIndex={0} className="  z-[1] w-full">
                  {realData?.data?.SW?.weaknesses?.map((i, index) => {
                    return (
                      <li key={index} className="mt-5 mb-5">
                        <a> Topic: {i?.objective_name}</a>
                        <br />
                        <a> Score: {i?.score}</a>
                        <br />
                        <a>National Ranking: {i?.national_percentile_rank}</a>
                        <br />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-[50%] max-w-[50%]">
        {/* <BarChart
  width={500}
  height={300}
  data={newdata}
  margin={{
    top: 5,
    right: 30,
    left: 20,
    bottom: 5,
  }}
  orientation="vertical"
 
>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="student" fill="#8884d8" />
  <Bar dataKey="class" fill="#82ca9d" />
  <Bar dataKey="country" fill="#088F8F" />
</BarChart> */}

        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          orientation="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="student" fill="#8884d8" />
          <Bar dataKey="class" fill="#82ca9d" />
          <Bar dataKey="country" fill="#088F8F" />
        </BarChart>
      </div>
    </div>
  );
};

export default StrengthsAndweaknesses;
