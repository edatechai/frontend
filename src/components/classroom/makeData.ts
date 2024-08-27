export type Person = {
  fullName: string;
  behaviour: number;
  attitude_rating: number;
  attendance: number;
  _id: string;
  username: string;
};

export type StudentData = {
  _id: string;
  fullName: string;
  username: string;
  __v: number;
}[];

const newPerson = ({ fullName, _id, username }: StudentData[0]): Person => {
  return {
    fullName,
    attendance: 8,
    attitude_rating: 8,
    behaviour: 8,
    _id,
    username,
  };
};

export function makeData(studentData: StudentData) {
  const makeDataLevel = (): Person[] => {
    return studentData.map((d): Person => {
      return {
        ...newPerson(d),
      };
    });
  };

  return makeDataLevel();
}
