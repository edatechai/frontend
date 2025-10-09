import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetGeneratedLessonsQuery, useLazyGetLessonPlanQuery, useDeleteLessonPlanMutation, useCurrentUserQuery, useFindMyClassesTeacherQuery } from '@/features/api/apiSlice';
import { toast } from 'sonner';
import { Filter, X, Calendar, Download, Eye, Trash2 } from 'lucide-react';

interface Lesson {
  key: string;
  url: string;
  pdfUrl?: string;
  subject: string;
  topic: string;
  last_modified: string;
  classroomName: string;
  classroomId?: string;
  session?: string;
  class?: string;
  _id?: string;
  created_at?: any;
}

const GeneratedLessons: React.FC = () => {
  const { data, isLoading, isError } = useGetGeneratedLessonsQuery();
  // NEW: Delete mutation
  const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonPlanMutation();
  const { data: currentUser } = useCurrentUserQuery();
  const { data: teacherClassesData } = useFindMyClassesTeacherQuery(currentUser?._id, {
    skip: !currentUser?._id,
  });

   // NEW: Track which lessons are being deleted
  const [deletingLessons, setDeletingLessons] = React.useState<Set<string>>(new Set());

  // Delete handler function
  const handleDeleteLesson = async (lesson: Lesson) => {
    if (!window.confirm(`Are you sure you want to delete the lesson "${lesson.topic}"?`)) {
      return;
    }
           // Use the actual key from the lesson object (not lesson.key if it's different)
          const keyToDelete = lesson.key || lesson.filename;

    try {
      
      // Add this lesson to deleting state
      setDeletingLessons(prev => new Set(prev).add(keyToDelete));

      await deleteLesson(keyToDelete).unwrap();
      toast.success('Lesson plan deleted successfully');
      // The list will automatically refetch due to invalidated tags
    } catch (error) {
      console.error('Failed to delete lesson:', error);
      toast.error('Failed to delete lesson plan');
    } finally {
      // Remove from deleting state regardless of success/failure
      setDeletingLessons(prev => {
        const newSet = new Set(prev);
        newSet.delete(keyToDelete);
        return newSet;
      });
    }
  };

  // Helper function to check if a specific lesson is being deleted
  const isLessonDeleting = (lesson: Lesson) => {
    const key = lesson.key || lesson.filename;
    return deletingLessons.has(key);
  };

  // State for filters
  const [filters, setFilters] = React.useState({
    subject: '',
    session: '',
    topic: '',
    class: '',
    date: ''
  });
  const [hasAppliedFilters, setHasAppliedFilters] = React.useState(false);

  const classroomMap = React.useMemo(() => {
    const map = new Map<string, string>();
    if (teacherClassesData?.data) {
      teacherClassesData.data.forEach((cls: any) => {
        map.set(cls._id, cls.classRoomName);
      });
    }
    return map;
  }, [teacherClassesData]);

  const lessons = data?.lessons || [];

  const [trigger, { data: lessonPlanContent, isLoading: isLessonLoading }] = useLazyGetLessonPlanQuery();
  const [currentPage, setCurrentPage] = React.useState(0);
  const [pages, setPages] = React.useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = React.useState<Lesson | null>(null);

  // Function to get PDF URL
  const getPdfUrl = (lesson: any): string | null => {
    if (lesson.pdfUrl) return lesson.pdfUrl;
    if (lesson.pdf_url) return lesson.pdf_url;
    if (lesson.pdf) return lesson.pdf;
    if (lesson.pdfFile) return lesson.pdfFile;
    if (lesson.pdf_file) return lesson.pdf_file;
    return null;
  };

  // Filter lessons based on current filters
  const filteredLessons = React.useMemo(() => {
    if (!hasAppliedFilters) {
      return []; // Show empty until filters are applied
    }
    
    return lessons.filter(lesson => {      
      // Subject filter - show all if "all-subjects" or empty
      const subjectMatch = !filters.subject || 
                          filters.subject === 'all-subjects' ||
                          lesson.subject?.toLowerCase().includes(filters.subject.toLowerCase());
      
      // Session filter - show all if "all-sessions" or empty
      const sessionMatch = !filters.session || 
                          filters.session === 'all-sessions' ||
                          lesson.session?.toLowerCase().includes(filters.session.toLowerCase());
      
      // Topic filter - show all if empty
      const topicMatch = !filters.topic || 
                        lesson.topic?.toLowerCase().includes(filters.topic.toLowerCase());
      
      // Class filter - show all if "all-classes" or empty
      const classMatch = !filters.class || 
                        filters.class === 'all-classes' ||
                        lesson.class?.toLowerCase().includes(filters.class.toLowerCase()) ||
                        lesson.classroomName?.toLowerCase().includes(filters.class.toLowerCase());
      
      // Date filter - fixed comparison
      const dateMatch = !filters.date || 
                       (lesson.last_modified && 
                        new Date(lesson.last_modified).toISOString().split('T')[0] === filters.date);

      return subjectMatch && sessionMatch && topicMatch && classMatch && dateMatch;
    });
  }, [lessons, filters, hasAppliedFilters]);

  // Get unique values for dropdowns from backend data with validation
  const uniqueSubjects = React.useMemo(() => {
    const subjects = new Set<string>();
    lessons.forEach(lesson => {
      if (lesson.subject && lesson.subject.trim() !== '' && lesson.subject !== 'Unknown') {
        subjects.add(lesson.subject);
      }
    });
    return Array.from(subjects).sort();
  }, [lessons]);

  const uniqueSessions = React.useMemo(() => {
    const sessions = new Set<string>();
    lessons.forEach(lesson => {
      if (lesson.session && lesson.session.trim() !== '' && lesson.session !== 'Unknown') {
        sessions.add(lesson.session);
      }
    });
    return Array.from(sessions).sort();
  }, [lessons]);

  const uniqueClasses = React.useMemo(() => {
    const classes = new Set<string>();
    lessons.forEach(lesson => {
      if (lesson.class && lesson.class.trim() !== '' && lesson.class !== 'Unknown') {
        classes.add(lesson.class);
      }
    });
    return Array.from(classes).sort();
  }, [lessons]);

  const handlePdfDownload = async (lesson: Lesson) => {
    const pdfUrl = getPdfUrl(lesson);
    if (!pdfUrl) {
      toast.error('PDF version not available for this lesson');
      return;
    }

    try {
      const newWindow = window.open(pdfUrl, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
        toast.info('PDF download started. If blocked, check your popup settings.');
      }
    } catch (error) {
      console.error('PDF download error:', error);
      toast.error('Unable to download PDF. Please configure CORS on your S3 bucket.');
    }
  };

  const handleViewLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    trigger(lesson.key);
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setFilters({
      subject: '',
      session: '',
      topic: '',
      class: '',
      date: ''
    });
    setHasAppliedFilters(false);
  };

  const applyFilters = () => {
    setHasAppliedFilters(true);
  };

  // Check if there are any active filters (excluding "all-" options and empty values)
  const hasActiveFilters = React.useMemo(() => {
    return Object.values(filters).some(filter => 
      filter && 
      filter !== 'all-subjects' && 
      filter !== 'all-sessions' && 
      filter !== 'all-classes'
    );
  }, [filters]);

  // Check if we should enable the Apply Filters button
  const shouldEnableApplyButton = React.useMemo(() => {
    // Enable if any filter has a value (even if it's "all-" options)
    return Object.values(filters).some(filter => filter !== '');
  }, [filters]);

  React.useEffect(() => {
    if (lessonPlanContent) {
      const slideSplitRegex = /(?=Slide \d+ )/;
      const lessonPages = lessonPlanContent
        .split(slideSplitRegex)
        .filter(page => page.trim() !== '');
      setPages(lessonPages);
    } else {
      setPages([]);
    }
  }, [lessonPlanContent]);

  const formatDateWithOrdinal = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();

    const getOrdinal = (n: number): string => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    return `${month} ${day}${getOrdinal(day)}, ${year}`;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center py-12">Loading lessons...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center py-12 text-red-600">Error fetching lessons.</div>;
  }

  return (
    <>
      {/* Header Section */}
      <div className="mb-6">
        {/* <h1 className="text-2xl font-bold mb-2">Generated Lessons</h1> */}
        <p className="text-muted-foreground">
          {hasAppliedFilters 
            ? `Showing ${filteredLessons.length} of ${lessons.length} lessons` 
            : ` Find specific lesson plans`}
        </p>
      </div>

      {/* Filter Panel */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Lesson Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Subject Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select value={filters.subject} onValueChange={(value) => setFilters(prev => ({ ...prev, subject: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-subjects">All Subjects</SelectItem>
                  {uniqueSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Session Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Session</label>
              <Select value={filters.session} onValueChange={(value) => setFilters(prev => ({ ...prev, session: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All sessions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-sessions">All Sessions</SelectItem>
                  {uniqueSessions.map(session => (
                    <SelectItem key={session} value={session}>
                      {session}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Class Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <Select value={filters.class} onValueChange={(value) => setFilters(prev => ({ ...prev, class: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-classes">All Classes</SelectItem>
                  {uniqueClasses.map(classItem => (
                    <SelectItem key={classItem} value={classItem}>
                      {classItem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Topic Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic</label>
              <Input
                placeholder="Search topics..."
                value={filters.topic}
                onChange={(e) => setFilters(prev => ({ ...prev, topic: e.target.value }))}
              />
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Created</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t">
            <Button 
              onClick={applyFilters}
              disabled={!shouldEnableApplyButton}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Apply Filters
            </Button>
            <Button 
              variant="outline" 
              onClick={clearFilters}
              disabled={!hasActiveFilters && !hasAppliedFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === 'all-subjects' || value === 'all-sessions' || value === 'all-classes') return null;
                
                const filterLabels: { [key: string]: string } = {
                  subject: 'Subject',
                  session: 'Session',
                  topic: 'Topic',
                  class: 'Class',
                  date: 'Date'
                };

                return (
                  <div
                    key={key}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    <span>{filterLabels[key]}: {value}</span>
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section - Only show when filters are applied */}
      {hasAppliedFilters ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {hasActiveFilters ? 'Filtered Lessons' : 'All Lesson Plans'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Topic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-48">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Session</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Date Created</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-64">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLessons.map((lesson, index) => {
                    const pdfUrl = getPdfUrl(lesson);
                    const hasPdf = !pdfUrl;

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 max-w-sm whitespace-normal break-words text-sm font-medium text-gray-900">
                          {lesson.topic}
                        </td>
                        <td className="px-6 py-4 whitespace-normal break-words text-sm text-gray-500">
                          {lesson.subject}
                        </td>
                        <td className="px-6 py-4 max-w-xs whitespace-normal break-words text-sm text-gray-500">
                          <div className="break-words min-w-0">
                            {lesson.class}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lesson.session || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lesson.last_modified ? formatDateWithOrdinal(lesson.last_modified) : 'Date not available'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center min-w-0">
                            {/* Download PPT Button */}
                            <a 
                              href={lesson.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto"
                            >
                              <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={!lesson.url} 
                                className="flex items-center gap-1 w-full sm:w-auto"
                              >
                                <Download className="h-3 w-3" />
                                PPT
                              </Button>
                            </a>
                            
                            {/* Download PDF Button */}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              disabled={hasPdf} 
                              onClick={() => handlePdfDownload(lesson)}
                              className="flex items-center gap-1 w-full sm:w-auto"
                            >
                              <Download className="h-3 w-3" />
                              PDF
                            </Button>
                            
                            {/* View Button */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleViewLesson(lesson)}
                                  className="flex items-center gap-1 w-full sm:w-auto"
                                >
                                  <Eye className="h-3 w-3" />
                                  View
                                </Button>
                              </DialogTrigger>
                
                              {selectedLesson && selectedLesson.key === lesson.key && (
                                <DialogContent className="sm:max-w-[80%] h-[80vh] flex flex-col">
                                  {/* Sticky Dialog Header */}
                                  <CardHeader className="sticky top-0 bg-background z-10 border-b shrink-0">
                                    <CardTitle>Generated Lesson Plan</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {lesson.subject} - {lesson.topic} ({lesson.class})
                                    </p>
                                  </CardHeader>
                                  
                                  {/* Scrollable Content */}
                                  <CardContent className="flex-1 overflow-y-auto p-0">
                                    <div className="p-6">
                                      {isLessonLoading ? (
                                        <div className="flex justify-center items-center py-8">Loading lesson plan content...</div> 
                                      ) : lessonPlanContent ? (
                                <div className="space-y-6">
                                  {/* Split content into pages based on sections */}
                                  {(() => {
                                    // Split content into sections for pagination
                                    const sections = lessonPlanContent.split(/(?=## )/).filter(section => section.trim());
                                    const itemsPerPage = 1; // Show 3 sections per page
                                    const startIndex = currentPage * itemsPerPage;
                                    const endIndex = startIndex + itemsPerPage;
                                    const currentSections = sections.slice(startIndex, endIndex);

                                    return (
                                        <>
                                          {/* Current page sections */}
                                          {currentSections.map((section, index) => {
                                            const globalIndex = startIndex + index;
                                            const lines = section.split('\n').filter(line => line.trim());
                                            if (lines.length === 0) return null;
                                            
                                            const headerLine = lines[0];
                                            const contentLines = lines.slice(1);
                    
                                            // Check if it's a main section header (## Header)
                                            if (headerLine.startsWith('## ')) {
                                              const title = headerLine.replace('## ', '').trim();
                                              
                                              return (
                                                <div key={globalIndex} className="border rounded-lg p-4 bg-card">
                                                  <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">
                                                    {title}
                                                  </h3>
                                                  
                                                  <div className="space-y-3">
                                                    {contentLines.map((line, lineIndex) => {
                                                      if (!line.trim()) return <br key={lineIndex} />;
                                                      
                                                      // Handle different markdown elements
                                                      if (line.startsWith('### ')) {
                                                        // Sub-section header
                                                        return (
                                                          <h4 key={lineIndex} className="font-medium text-sm text-muted-foreground mt-4 mb-2">
                                                            {line.replace('### ', '')}
                                                          </h4>
                                                        );
                                                            } else if (line.startsWith('#### ')) {
                                                              // Sub-sub-section header
                                                              return (
                                                                <h5 key={lineIndex} className="font-medium text-xs text-muted-foreground mt-3 mb-1">
                                                                  {line.replace('#### ', '')}
                                                                </h5>
                                                              );
                                                            } else if (line.match(/^[•\-]\s/)) {
                                                              // Bullet points
                                                              return (
                                                                <div key={lineIndex} className="flex items-start">
                                                                  <span className="mr-2">•</span>
                                                                  <span className="text-sm">{line.replace(/^[•\-]\s*/, '')}</span>
                                                                </div>
                                                              );
                                                            } else if (line.match(/^\d+\./)) {
                                                              // Numbered list
                                                            return (
                                                              <div key={lineIndex} className="flex items-start">
                                                                <span className="mr-2 font-medium">{line.match(/^\d+/)?.[0]}.</span>
                                                                <span className="text-sm">{line.replace(/^\d+\.\s*/, '')}</span>
                                                              </div>
                                                            );
                                                          } else if (line.includes('**')) {
                                                            // Bold text
                                                            const parts = line.split(/\*\*(.*?)\*\*/g);
                                                            return (
                                                              <p key={lineIndex} className="text-sm">
                                                                {parts.map((part, partIndex) => 
                                                                  partIndex % 2 === 1 ? (
                                                                    <strong key={partIndex} className="font-semibold">{part}</strong>
                                                                  ) : (
                                                                    part
                                                                  )
                                                                )}
                                                              </p>
                                                            );
                                                          } else {
                                                            // Regular paragraph
                                                            return (
                                                              <p key={lineIndex} className="text-sm leading-relaxed">
                                                                {line}
                                                              </p>
                                                            );
                                                          }
                                                        })}
                                                      </div>
                                                    </div>
                                                  );
                                                } else {
                                                  // Handle non-header content (like the very beginning of the document)
                                                  return (
                                                    <div key={globalIndex} className="border rounded-lg p-4 bg-card">
                                                      <div className="space-y-2">
                                                        {lines.map((line, lineIndex) => (
                                                          <p key={lineIndex} className="text-sm leading-relaxed">
                                                            {line}
                                                          </p>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  );
                                                }
                                              })}

                                      {/* Pagination Controls */}
                                      {sections.length > itemsPerPage && (
                                        <div className="flex justify-between items-center mt-6 pt-4 border-t">
                                          <Button 
                                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))} 
                                            disabled={currentPage === 0}
                                            variant="outline"
                                          >
                                            Previous
                                          </Button>
                                          
                                          <span className="text-sm font-medium">
                                            Page {currentPage + 1} of {Math.ceil(sections.length / itemsPerPage)}
                                          </span>
                                          
                                          <Button 
                                            onClick={() => setCurrentPage(p => Math.min(Math.ceil(sections.length / itemsPerPage) - 1, p + 1))} 
                                            disabled={currentPage >= Math.ceil(sections.length / itemsPerPage) - 1}
                                            variant="outline"
                                          >
                                            Next
                                          </Button>
                                        </div>
                                      )}
                                    </>
                                          );
                                        })()}
                                      </div>
                                    ) : (
                                      <p className="text-center py-8 text-muted-foreground">No lesson plan content available.</p>
                                    )}
                                  </div>
                                </CardContent>
                              </DialogContent>
                            )}
                            </Dialog>

                                {/* Delete Button */}
                              {/* Delete Button */}
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDeleteLesson(lesson)}
                              disabled={isLessonDeleting(lesson)}
                              className="flex items-center gap-1 w-full sm:w-auto"
                            >
                              <Trash2 className="h-3 w-3" />
                              {isLessonDeleting(lesson) ? 'Deleting...' : 'Delete'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredLessons.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No lesson plan match your current filters
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Empty State - No filters applied */
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No filters applied</h3>
                <p className="text-muted-foreground text-sm">
                  Use the filter options above to find specific lesson plans by subject, session, topic, class, or date.
                  <br />
                  Select "All Subjects" and "All Classes" to see all available lesson plans.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default GeneratedLessons;
