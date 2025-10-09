import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGenerateLessonMutation, useFindMyClassesTeacherQuery, useFindAllObjectivesQuery, useGetAccountByIdQuery } from '@/features/api/apiSlice';
import { useToast } from '@/components/ui/use-toast';
import type { RootState } from '@/app/store';

// Define types
interface Classroom {
  _id: string;
  classRoomName: string;
}

interface LessonMetadata {
  student_count: number;
  targeted_students: string[];
  dialogic_questions: number;
  api_calls_used: number;
  cost_estimate: string;
  remaining_requests: number;
}

interface GenerateLessonResponse {
  lesson_plan: string;
  powerpoint_file: string;
  metadata: LessonMetadata;
}

interface LessonGeneratorProps {
  classroomId?: string;
  subject?: string;
}

const LessonGenerator: React.FC<LessonGeneratorProps> = ({ classroomId: propClassroomId, subject: propSubject }) => {
  const { toast } = useToast();
  const { userInfo: user } = useSelector((state: RootState) => state.user);
  const { data: schoolData } = useGetAccountByIdQuery(user?.accountId);

  const [subject, setSubject] = useState<string>(propSubject || '');
  const [topic, setTopic] = useState<string>('');
  const [classroomId, setClassroomId] = useState<string>(propClassroomId || '');
  const [duration, setDuration] = useState<number>(60);
  const [filteredObjectives, setFilteredObjectives] = useState([]);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const { data: classroomsData, isLoading: isLoadingClassrooms } = useFindMyClassesTeacherQuery(user?._id, {
    skip: !user?._id || !!propClassroomId,
  });

  const { data: allObjectives } = useFindAllObjectivesQuery({
    subject: propSubject,
    country: schoolData?.country,
  }, { skip: !propSubject || !schoolData?.country });
  
  const classrooms: Classroom[] = classroomsData?.data || [];

  const dropdownRef = useRef<HTMLUListElement>(null);

  const scrollUp = () => {
    if (dropdownRef.current) {
      dropdownRef.current.scrollBy({ top: -40, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.scrollBy({ top: 40, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (propClassroomId) {
      setClassroomId(propClassroomId);
    }
    if (propSubject) {
      setSubject(propSubject);
    }
  }, [propClassroomId, propSubject]);

  const [generateLesson, { data, isLoading, isError, error }] = useGenerateLessonMutation();

  const handleTopicChange = (e) => {
    const value = e.target.value;
    setTopic(value);

    if (value.trim() === "") {
      setFilteredObjectives([]);
    } else {
      const filtered = allObjectives
        ?.filter((objective) => {
          const searchValue = value.toLowerCase();
          const matchesSearch =
            objective?.objective?.toLowerCase().includes(searchValue) ||
            objective?.category?.toLowerCase().includes(searchValue) ||
            objective?.topic?.toLowerCase().includes(searchValue) ||
            objective?.subject?.toLowerCase().includes(searchValue);

          return matchesSearch;
        })
        .filter((objs) => {
          return objs.subject == propSubject;
        });

      setFilteredObjectives(filtered);
    }
  };

  const handleObjectiveSelect = (objective) => {
    setTopic(objective?.objective);
    setFilteredObjectives([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!classroomId || !subject || !topic) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please select a classroom and provide a subject and topic.",
      });
      return;
    }
    await generateLesson({ classroomId, subject, topic, duration });
  };

  const handleDownload = () => {
    if (data?.powerpoint_file) {
      try {
        const textData = data.powerpoint_file;
        const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const safeTopic = topic.replace(/[^a-zA-Z0-9_]/g, '_');
        link.download = `${safeTopic}_lesson.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        
        toast({
          title: "Download Started",
          description: "Your lesson plan is downloading as a text file.",
        });
      } catch (e) {
        console.error("Download failed:", e);
        toast({
          variant: "destructive",
          title: "Download Failed",
          description: "Could not process the file for download.",
        });
      }
    }
  };
  
  const responseData = data as GenerateLessonResponse | undefined;
  const mutationError = error as { data?: { error?: string } } | undefined;

  useEffect(() => {
    if (responseData?.lesson_plan) {
      const lessonPlan = responseData.lesson_plan;
      const pages = lessonPlan.split('--------------------------------').filter(page => page.trim() !== '');
      setPages(pages);
      setCurrentPage(0);
    }
  }, [responseData]);

  return (
    <div className="p-2 sm:p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Lesson Plan Generator</h1>
        <p className="text-muted-foreground">
          Create comprehensive, AI-powered lesson plans tailored to your students' needs.
        </p>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create a New Lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Mathematics" disabled={!!propSubject} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <div className="relative">
                      <Input
                        value={topic}
                        onChange={handleTopicChange}
                        type="text"
                        className=""
                        placeholder="Search for a learning objective"
                      />
                      {filteredObjectives?.length > 0 && (
                        <div className="absolute left-0 top-full bg-white border border-gray-300 w-full overflow-hidden z-10">
                          <button
                            type="button"
                            onClick={scrollUp}
                            className="w-full text-center py-1 bg-gray-200 hover:bg-gray-300"
                            aria-label="Scroll Up"
                          >
                            ▲
                          </button>
                          <ul
                            ref={dropdownRef}
                            className="max-h-60 overflow-y-auto"
                          >
                            {filteredObjectives.map((objective, index) => (
                              <li
                                key={index}
                                className="p-4 cursor-pointer first-letter:capitalize hover:bg-gray-100"
                                onClick={() => handleObjectiveSelect(objective)}
                              >
                                {objective?.objective}
                              </li>
                            ))}
                          </ul>
                          <button
                            type="button"
                            onClick={scrollDown}
                            className="w-full text-center py-1 bg-gray-200 hover:bg-gray-300"
                            aria-label="Scroll Down"
                          >
                            ▼
                          </button>
                        </div>
                      )}
                  </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input id="duration" type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value, 10) || 0)} />
                </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? 'Generating...' : 'Generate Lesson Plan'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isError && (
        <Card className="mb-6 bg-destructive text-destructive-foreground">
            <CardHeader>
                <CardTitle>Error Generating Lesson</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{mutationError?.data?.error || 'An unknown error occurred.'}</p>
            </CardContent>
        </Card>
      )}

      {responseData && (
        <Card>
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Your Generated Lesson Plan</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Lesson for "{topic}" in {classrooms.find(c => c._id === classroomId)?.classRoomName}
              </p>
            </div>
            {/* <Button onClick={handleDownload} disabled={!responseData.powerpoint_file} className="w-full md:w-auto">
              Download Lesson Plan
            </Button> */}
          </CardHeader>
          <CardContent>
            <Card className="bg-muted/50 mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">Lesson Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="text-sm space-y-2">
                        <li><strong>Student Count:</strong> {responseData.metadata.student_count}</li>
                        <li><strong>Targeted Student Groups:</strong> {responseData.metadata.targeted_students.join('; ') || 'N/A'}</li>
                        <li><strong>Dialogic Questions:</strong> {responseData.metadata.dialogic_questions}</li>
                        {/* <li><strong>AI Cost Estimate:</strong> {responseData.metadata.cost_estimate}</li> */}
                        <li><strong>Remaining Monthly Requests:</strong> {responseData.metadata.remaining_requests}</li>
                    </ul>
                </CardContent>
            </Card>
            <div className="prose prose-sm max-w-none bg-background p-4 rounded-md border">
              <pre className="whitespace-pre-wrap font-sans">
                {pages[currentPage]}
              </pre>
            </div>
            <div className="flex justify-between mt-4">
              <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0}>
                Previous
              </Button>
              <span>Page {currentPage + 1} of {pages.length}</span>
              <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= pages.length - 1}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LessonGenerator;