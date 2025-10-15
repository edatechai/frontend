import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// removed unused Select imports
import { useGenerateLessonMutation, useFindAllObjectivesQuery, useGetAccountByIdQuery } from '@/features/api/apiSlice';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
// avoid importing RootState here to prevent type mismatch; use `any` in selector

// Define types

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
  // using sonner's toast for consistency with generatedLessons.tsx
  const { userInfo: user } = useSelector((state: any) => state.user);
  const { data: schoolData } = useGetAccountByIdQuery(user?.accountId);

  const [subject, setSubject] = useState<string>(propSubject || '');
  const [topic, setTopic] = useState<string>('');
  const [classroomId, setClassroomId] = useState<string>(propClassroomId || '');
  const [duration, setDuration] = useState<number>(60);
  const [filteredObjectives, setFilteredObjectives] = useState<any[]>([]);
  // pages/currentPage removed — detailed generated lesson rendering hidden

  // classrooms query removed — not used in this component

  const { data: allObjectives } = useFindAllObjectivesQuery({
    subject: propSubject,
    country: schoolData?.country,
  }, { skip: !propSubject || !schoolData?.country });
  
  // classrooms list not used in this component

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

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTopic(value);

    if (value.trim() === "") {
      setFilteredObjectives([]);
    } else {
      const filtered = allObjectives
        ?.filter((objective: any) => {
          const searchValue = value.toLowerCase();
          const matchesSearch =
            objective?.objective?.toLowerCase().includes(searchValue) ||
            objective?.category?.toLowerCase().includes(searchValue) ||
            objective?.topic?.toLowerCase().includes(searchValue) ||
            objective?.subject?.toLowerCase().includes(searchValue);

          return matchesSearch;
        })
        .filter((objs: any) => {
          return objs.subject == propSubject;
        });

      setFilteredObjectives(filtered);
    }
  };

  const handleObjectiveSelect = (objective: any) => {
    setTopic(objective?.objective);
    setFilteredObjectives([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!classroomId || !subject || !topic) {
      toast.error('Missing Fields — please select a classroom and provide a subject and topic.');
      return;
    }
    await generateLesson({ classroomId, subject, topic, duration });
  };

  // Small animated dots component
  const AnimatedDots: React.FC = () => (
    <span className="inline-flex items-center">
      <span className="w-2 h-2 bg-current rounded-full animate-bounce mr-1" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-current rounded-full animate-bounce mr-1" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  );

  // handleDownload removed (unused) to avoid unused-local TypeScript errors
  
  const responseData = data as GenerateLessonResponse | undefined;
  const mutationError = error as { data?: { error?: string } } | undefined;

  // detailed response parsing removed — rendering hidden in this component

  // Show a single success toast when a lesson is generated instead of rendering a Card
  const [shownSuccessToast, setShownSuccessToast] = React.useState(false);
  // Reset the shown flag when a new generation starts so we can show toast again
  React.useEffect(() => {
    if (isLoading) {
      setShownSuccessToast(false);
    }
  }, [isLoading]);

  React.useEffect(() => {
    // Only show the toast when the mutation returned a lesson_plan (generation finished)
    if (responseData?.lesson_plan && !shownSuccessToast) {
      try {
        toast.success('Lesson plan generated successfully');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to show sonner toast', err);
      }
      setShownSuccessToast(true);
    }
  }, [responseData, shownSuccessToast]);

  return (
    <>
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
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto inline-flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Generating
                    <AnimatedDots />
                  </>
                ) : (
                  'Generate Lesson Plan'
                )}
              </Button>
            
            </div>
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

      {/* responseData no longer renders a Card; a toast notification is shown when generation completes */}

      {/* detailed generated lesson rendering intentionally hidden */}
    </div>
    {/* no inline fallback banner — using sonner toast */}
    </>
  );
};

export default LessonGenerator;