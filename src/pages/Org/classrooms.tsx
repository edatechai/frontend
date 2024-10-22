import {
  ArmColumns,
  subjectColumns,
  yearGroupColumns,
} from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetAllArmsByAccountIDQuery,
  useGetAllSubjectsByAccountIDQuery,
  useGetAllYearGroupsByAccountIDQuery,
} from "@/features/api/apiSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  CreateArm,
  CreateSubject,
  CreateYearGroup,
} from "@/components/org/classSettings";

const Classrooms = () => {
  const userInfo = useSelector((state) => state?.user.userInfo);
  const { data, isLoading: yearGroupLoading } =
    useGetAllYearGroupsByAccountIDQuery(userInfo?.accountId);
  const { data: arms, isLoading: armsIsLoading } =
    useGetAllArmsByAccountIDQuery(userInfo?.accountId);
  const { data: subjects, isLoading: subjectIsLoading } =
    useGetAllSubjectsByAccountIDQuery(userInfo?.accountId);
  const [showYearGroupDialog, setShowYearGroupDialog] = useState(false);
  const [showArmDialog, setShowArmDialog] = useState(false);
  const [showSubjectDialog, setShowSubjectDialog] = useState(false);

  return (
    <Tabs defaultValue="yearGroup">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="yearGroup">Year groups</TabsTrigger>
          <TabsTrigger value="arm">Arms</TabsTrigger>
          <TabsTrigger value="subject">Subjects</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="yearGroup">
        <div className="w-full flex justify-end">
          <Button onClick={() => setShowYearGroupDialog(true)}>
            Create year group
          </Button>
        </div>
        <Dialog
          open={showYearGroupDialog}
          onOpenChange={setShowYearGroupDialog}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create year group</DialogTitle>
              <DialogDescription>
                Enter the name of the year group. Click "create year group" when
                you're done.
              </DialogDescription>
            </DialogHeader>
            <CreateYearGroup
              userInfo={userInfo}
              setShowYearGroupDialog={setShowYearGroupDialog}
            />
          </DialogContent>
        </Dialog>

        <DataTable
          columns={yearGroupColumns}
          data={data || []}
          isLoading={yearGroupLoading}
        />
      </TabsContent>
      <TabsContent value="arm">
        <Dialog open={showArmDialog} onOpenChange={setShowArmDialog}>
          <DialogTrigger asChild>
            <div className="w-full flex justify-end">
              <Button>Create new arm</Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create new arm</DialogTitle>
              <DialogDescription>
                Enter the name of the arm. Click "create arm" when you're done.
              </DialogDescription>
            </DialogHeader>
            <CreateArm
              userInfo={userInfo}
              setShowArmDialog={setShowArmDialog}
            />
          </DialogContent>
        </Dialog>
        <DataTable
          columns={ArmColumns}
          data={arms?.aims || []}
          isLoading={armsIsLoading}
        />
      </TabsContent>
      <TabsContent value="subject">
        <Dialog open={showSubjectDialog} onOpenChange={setShowSubjectDialog}>
          <DialogTrigger asChild>
            <div className="w-full flex justify-end">
              <Button>Create new subject</Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create new subject</DialogTitle>
              <DialogDescription>
                Enter the name of the subject. Click "create subject" when
                you're done.
              </DialogDescription>
            </DialogHeader>
            <CreateSubject
              userInfo={userInfo}
              setShowSubjectDialog={setShowSubjectDialog}
            />
          </DialogContent>
        </Dialog>
        <DataTable
          columns={subjectColumns}
          data={subjects?.subjects || []}
          isLoading={subjectIsLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default Classrooms;
