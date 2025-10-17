import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetGeneratedLessonsQuery, useLazyGetLessonPlanQuery, useDeleteLessonPlanMutation } from '@/features/api/apiSlice';
import { toast } from 'sonner';
import { Filter, X, Calendar, Eye, Trash2, MoreVertical, FileText, Presentation, Smartphone, Monitor, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface Lesson {
  key: string;
  url: string;
  pdfUrl?: string;
  filename?: string;
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

const GeneratedLessons: React.FC = (): JSX.Element => {
  const { data, isLoading, isError } = useGetGeneratedLessonsQuery(undefined);
  const [deleteLesson] = useDeleteLessonPlanMutation();
  // intentionally not subscribing to teacher classes data here; only needed elsewhere

  const [deletingLessons, setDeletingLessons] = React.useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = React.useState(false);

  // Check screen size on mount and resize
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Delete handler function
  const handleDeleteLesson = async (lesson: Lesson) => {
    if (!window.confirm(`Are you sure you want to delete the lesson "${lesson.topic}"?`)) {
      return;
    }
    const keyToDelete = lesson.key ?? lesson.filename ?? '';
    if (!keyToDelete) {
      toast.error('Cannot determine lesson identifier to delete');
      return;
    }

    try {
      setDeletingLessons(prev => {
        const next = new Set(prev);
        next.add(keyToDelete);
        return next;
      });
      await deleteLesson(keyToDelete).unwrap();
      toast.success('Lesson plan deleted successfully');
    } catch (error) {
      console.error('Failed to delete lesson:', error);
      toast.error('Failed to delete lesson plan');
    } finally {
      setDeletingLessons(prev => {
        const newSet = new Set(prev);
        newSet.delete(keyToDelete);
        return newSet;
      });
    }
  };

  // Helper function to check if a specific lesson is being deleted
  const isLessonDeleting = (lesson: Lesson) => {
    const key = lesson.key ?? lesson.filename ?? '';
    return key ? deletingLessons.has(key) : false;
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
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  const lessons = data?.lessons || [];
  const [trigger, { data: lessonPlanContent, isLoading: isLessonLoading }] = useLazyGetLessonPlanQuery();
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isFetchingLesson, setIsFetchingLesson] = React.useState(false);
  const [viewLoadingKey, setViewLoadingKey] = React.useState<string | null>(null);
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

  // We'll use react-markdown + plugins for full markdown support

  // Filter lessons based on current filters
  const filteredLessons = React.useMemo(() => {
    if (!hasAppliedFilters) {
      return [];
    }

    return lessons.filter((lesson: Lesson) => {
      const subjectMatch = !filters.subject ||
        filters.subject === 'all-subjects' ||
        lesson.subject?.toLowerCase().includes(filters.subject.toLowerCase());

      const sessionMatch = !filters.session ||
        filters.session === 'all-sessions' ||
        lesson.session?.toLowerCase().includes(filters.session.toLowerCase());

      const topicMatch = !filters.topic ||
        lesson.topic?.toLowerCase().includes(filters.topic.toLowerCase());

      const classMatch = !filters.class ||
        filters.class === 'all-classes' ||
        lesson.class?.toLowerCase().includes(filters.class.toLowerCase()) ||
        lesson.classroomName?.toLowerCase().includes(filters.class.toLowerCase());

      const dateMatch = !filters.date ||
        (lesson.last_modified &&
          new Date(lesson.last_modified).toISOString().split('T')[0] === filters.date);

      return subjectMatch && sessionMatch && topicMatch && classMatch && dateMatch;
    });
  }, [lessons, filters, hasAppliedFilters]);

  // Get unique values for dropdowns from backend data with validation
  const uniqueSubjects = React.useMemo(() => {
    const subjects = new Set<string>();
    lessons.forEach((lesson: Lesson) => {
      if (lesson.subject && lesson.subject.trim() !== '' && lesson.subject !== 'Unknown') {
        subjects.add(lesson.subject);
      }
    });
    return Array.from(subjects).sort();
  }, [lessons]);

  const uniqueSessions = React.useMemo(() => {
    const sessions = new Set<string>();
    lessons.forEach((lesson: Lesson) => {
      if (lesson.session && lesson.session.trim() !== '' && lesson.session !== 'Unknown') {
        sessions.add(lesson.session);
      }
    });
    return Array.from(sessions).sort();
  }, [lessons]);

  const uniqueClasses = React.useMemo(() => {
    const classes = new Set<string>();
    lessons.forEach((lesson: Lesson) => {
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

  const handleViewLesson = async (lesson: Lesson) => {
    console.debug('handleViewLesson clicked', lesson?.key || lesson?.url || lesson?.topic);
    // Do not open the dialog immediately. Show loading indicators, then open dialog after fetch completes.
    setCurrentPage(0);
    setIsFetchingLesson(true);
    setViewLoadingKey(lesson.key ?? lesson.filename ?? null);
    // Try textual lesson fetch first. If that fails or returns empty, fallback to opening original file (PDF/PPT).
    try {
      const keyToFetch = lesson.key ?? lesson.filename ?? '';
      if (!keyToFetch) {
        // No key to fetch - fallback to original file if present
        const urlToOpen = lesson.url || getPdfUrl(lesson) || '';
        if (urlToOpen) {
          window.open(urlToOpen, '_blank');
          return;
        }
        toast.error('Unable to fetch lesson content: missing lesson identifier');
        return;
      }

      const triggered = await trigger(keyToFetch as string);
      // If we got data (text) and it's non-empty, show it in the dialog; otherwise fall back.
      if ((triggered as any).data) {
        const text = (triggered as any).data as string;
        // Open the dialog after a short delay (allows dropdown/menu to close)
        setTimeout(() => setSelectedLesson(lesson), 120);
        if (typeof text === 'string' && text.trim().length > 0) {
          // success - lessonPlanContent will be populated by RTK Query and the dialog will display it
          return;
        }
        // empty text -> fallback: still open dialog and also open original file if available
        const urlToOpen = lesson.url || getPdfUrl(lesson) || '';
        if (urlToOpen) {
          window.open(urlToOpen, '_blank');
        } else {
          toast.error('No lesson plan text available');
        }
        return;
      }

      // If trigger returned an error, try to fallback to binary
      if ((triggered as any).error) {
        console.error('Failed to fetch lesson plan', (triggered as any).error);
  // Open dialog to show error state and provide fallback button (delayed so menu closes first)
  setTimeout(() => setSelectedLesson(lesson), 120);
        const urlToOpen = lesson.url || getPdfUrl(lesson) || '';
        if (urlToOpen) {
          window.open(urlToOpen, '_blank');
        } else {
          toast.error('Failed to load lesson plan content');
        }
      }
    } catch (err) {
      console.error('trigger error', err);
  // opening dialog so user can see fallback UI (delayed so menu closes first)
  setTimeout(() => setSelectedLesson(lesson), 120);
      const urlToOpen = lesson.url || getPdfUrl(lesson) || '';
      if (urlToOpen) {
        window.open(urlToOpen, '_blank');
      } else {
        toast.error('An error occurred while fetching the lesson plan');
      }
    } finally {
      setIsFetchingLesson(false);
      setViewLoadingKey(null);
    }
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
    setShowMobileFilters(false);
  };

  const applyFilters = () => {
    setHasAppliedFilters(true);
    setShowMobileFilters(false);
  };

  // Check if there are any active filters (excluding "all-" options and empty values)
  const hasActiveFilters = React.useMemo(() => {
    return Object.values(filters).some((filter: string) =>
      !!filter &&
      filter !== 'all-subjects' &&
      filter !== 'all-sessions' &&
      filter !== 'all-classes'
    );
  }, [filters]);

  // Check if we should enable the Apply Filters button
  const shouldEnableApplyButton = React.useMemo(() => {
    return Object.values(filters).some((filter: string) => filter !== '');
  }, [filters]);

  // (pages state was removed — pagination is handled inline when rendering lessonPlanContent)

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

    // Clean up sections to remove explicit "Slide N" headings that some generators emit
    const sanitizeSection = (section: string) => {
      if (!section) return '';
      let s = section;
      // Remove markdown headings like "# Slide 1" or "## Slide 1 - Title"
      s = s.replace(/^\s*#{1,6}\s*Slide\s*\d+[:.\-]?\s*/gim, '');
      // Remove lines that start with "Slide 1" or "(Slide 1)"
      s = s.replace(/^\s*\(?Slide\s*\d+\)?[:.\-]?\s*/gim, '');
      // Remove any parenthetical slide markers at start of line
      s = s.replace(/^\s*\(Slide\s*\d+\)\s*/gim, '');
      return s.trim();
    };

    // Robust splitter: try several heuristics to split raw lesson text into logical sections/slides
    const splitIntoSections = (rawText: string) => {
      const text = rawText || '';
      // Strategy 1: horizontal rules (---) between slides
      let parts = text.split(/(?:\r?\n){0,1}\-{3,}(?:\r?\n){0,1}/g);
      if (parts.length <= 1) {
        // Strategy 2: split by markdown H2 headings (## ) where many generators separate slides
        parts = text.split(/(?=## )/);
      }
      if (parts.length <= 1) {
        // Strategy 3: split by lines that begin with 'Slide N' markers
        parts = text.split(/(?=^\s*Slide\s+\d+)/im);
      }
      // Fallback: split by double newline into paragraphs if still single
      if (parts.length <= 1) {
        parts = text.split(/\n{2,}/g);
      }

      return parts.map(sanitizeSection).filter((s) => s && s.trim() !== '');
    };

    // Reset pagination when the loaded lesson content or selected lesson changes
    React.useEffect(() => {
      setCurrentPage(0);
    }, [lessonPlanContent, selectedLesson]);

  // Note: Mobile-specific card view removed. Desktop table row/dialog is used across screen sizes
  // The table is responsive (overflow-x-auto) so it remains compact on small screens.

  // Desktop Table Row Component
  const DesktopTableRow = ({ lesson }: { lesson: Lesson }) => {
    const pdfUrl = getPdfUrl(lesson);
    const hasPdf = !!pdfUrl;

    return (
      <tr key={lesson.key} className="hover:bg-gray-50">
        <td className="px-4 py-4 max-w-sm whitespace-normal break-words text-sm font-medium text-gray-900">
          {lesson.topic}
        </td>
        <td className="px-4 py-4 whitespace-normal break-words text-sm text-gray-500">
          {lesson.subject}
        </td>
        <td className="px-4 py-4 max-w-xs whitespace-normal break-words text-sm text-gray-500">
          <div className="break-words min-w-0">
            {lesson.class}
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
          {lesson.session || 'N/A'}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
          {lesson.last_modified ? formatDateWithOrdinal(lesson.last_modified) : 'Date not available'}
        </td>
        <td className="px-4 py-4">
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <a 
                    href={lesson.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center cursor-pointer"
                  >
                    <Presentation className="h-4 w-4 mr-2" />
                    Download PPT
                  </a>
                </DropdownMenuItem>
                
                <DropdownMenuItem
                  onClick={() => handlePdfDownload(lesson)}
                  disabled={!hasPdf}
                  className="flex items-center cursor-pointer"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  onClick={() => handleViewLesson(lesson)}
                  className="flex items-center cursor-pointer"
                  disabled={viewLoadingKey === (lesson.key ?? lesson.filename ?? null)}
                >
                  {viewLoadingKey === (lesson.key ?? lesson.filename ?? null) ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      View Lesson
                    </>
                  )}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => handleDeleteLesson(lesson)}
                  disabled={isLessonDeleting(lesson)}
                  className="flex items-center cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isLessonDeleting(lesson) ? 'Deleting...' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </td>
      </tr>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center py-12">Loading lessons...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center py-12 text-red-600">Error fetching lessons.</div>;
  }

  return (
    <>
      {/* Global Dialog used for viewing lesson content */}
      <Dialog open={!!selectedLesson} onOpenChange={(open) => { if (!open) setSelectedLesson(null); }}>
        <DialogContent className="sm:max-w-[80%] h-[80vh] flex flex-col">
          <DialogTitle className="sr-only">Generated Lesson Plan</DialogTitle>
          <DialogDescription className="sr-only">View generated lesson plan content and slides</DialogDescription>
          {selectedLesson && (
            <>
              <CardHeader className="sticky top-0 bg-background z-9 border-b shrink-0 flex items-left justify-between gap-2">
                <div>
                  <CardTitle className="max-w-[40%] truncate">Generated Lesson Plan</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedLesson.subject} - {selectedLesson.topic} ({selectedLesson.class})
                  </p>
                </div>
                {/* Close button intentionally removed — dialog can be closed via outside click or Escape */}
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-0">
                <div className="p-6">
                  {(isFetchingLesson || isLessonLoading) ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div role="status" aria-live="polite" className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full border-4 border-t-transparent animate-spin border-primary" />
                        <span className="text-sm font-medium">Loading lesson plan...</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">This may take a few seconds for large lessons.</p>
                    </div>
                  ) : lessonPlanContent ? (
                    <div className="space-y-6">
                      {(() => {
                        const raw = (lessonPlanContent as string) || '';
                        const sections = splitIntoSections(raw);
                        const itemsPerPage = 5;
                        const startIndex = currentPage * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const currentSections = sections.slice(startIndex, endIndex);

                        return (
                          <>
                            {currentSections.map((section: string, index: number) => {
                              const globalIndex = startIndex + index;
                              if (!section || section.trim() === '') return null;

                              return (
                                <div key={globalIndex} className="border rounded-lg p-3 bg-card">
                                  <div className="max-w-none text-sm">
                                    <ReactMarkdown
                                      remarkPlugins={[remarkGfm]}
                                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                                      components={{
                                        p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                                        h1: ({ node, ...props }) => <h1 className="text-xl font-semibold mt-4 mb-2" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-lg font-semibold mt-4 mb-2" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-base font-semibold mt-3 mb-2" {...props} />,
                                        h4: ({ node, ...props }) => <h4 className="text-sm font-medium mt-2 mb-1" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-1 mb-3" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-1 mb-3" {...props} />,
                                        li: ({ node, ...props }) => <li className="ml-1" {...props} />,
                                        code: ({ inline, className, children, ...props }) => {
                                          return inline ? (
                                            <code className="px-1 py-0.5 rounded bg-muted/20 text-sm" {...props}>{children}</code>
                                          ) : (
                                            <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded my-3 overflow-auto"><code {...props}>{children}</code></pre>
                                          );
                                        },
                                        blockquote: ({ node, ...props }) => (
                                          <blockquote className="border-l-4 pl-4 italic text-muted-foreground my-3" {...props} />
                                        ),
                                        table: ({ node, ...props }) => <table className="table-auto w-full text-sm border-collapse" {...props} />,
                                        thead: ({ node, ...props }) => <thead className="bg-muted/10" {...props} />,
                                        th: ({ node, ...props }) => <th className="px-2 py-1 text-left text-xs font-medium text-muted-foreground" {...props} />,
                                        td: ({ node, ...props }) => <td className="px-2 py-1 align-top" {...props} />,
                                      }}
                                    >
                                      {section}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              );
                            })}

                            {sections.length > itemsPerPage && (
                              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                                <Button 
                                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))} 
                                  disabled={currentPage === 0}
                                  variant="outline"
                                  size="sm"
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
                                  size="sm"
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
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No lesson plan content available.</p>
                      {(selectedLesson.url || getPdfUrl(selectedLesson)) && (
                        <div className="mt-4">
                          <Button variant="outline" onClick={() => window.open(selectedLesson.url || getPdfUrl(selectedLesson) || '', '_blank')}>Open original file</Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Global top-right loading indicator for lesson view actions */}
      {(isFetchingLesson || viewLoadingKey) && (
        <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 border border-gray-200 dark:border-slate-700 px-3 py-2 rounded-md shadow-lg">
          <Loader className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium">Loading lesson...</span>
        </div>
      )}
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-muted-foreground">
            {hasAppliedFilters 
              ? `Showing ${filteredLessons.length} of ${lessons.length} lessons` 
              : `Find specific lesson plans`}
          </p>
          
          {/* View Toggle - Mobile Only */}
          {isMobile && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Smartphone className="h-4 w-4" />
              {/* <span>Mobile View</span> */}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      {isMobile && (
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                Active
              </Badge>
            )}
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      {(!isMobile || showMobileFilters) && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Lesson Plans
              {isMobile && (
                <Monitor className="h-4 w-4 ml-auto text-muted-foreground" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5'}`}>
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
            <div className={`flex gap-3 mt-6 pt-4 border-t ${isMobile ? 'flex-col' : 'flex-row'}`}>
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
      )}

      {/* Results Section */}
      {hasAppliedFilters ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {hasActiveFilters ? 'Filtered Lesson Plans' : 'All Lesson Plans'}
              <Badge variant="secondary" className="ml-2">
                {filteredLessons.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Topic</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Subject</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Class</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Session</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Date Created</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLessons.map((lesson: Lesson) => (
                      <DesktopTableRow key={lesson.key} lesson={lesson} />
                    ))}
                  </tbody>
                </table>
                {filteredLessons.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No lesson plans match your current filters
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
              {isMobile && (
                <Button 
                  onClick={() => setShowMobileFilters(true)}
                  className="mt-4"
                >
                  Show Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default GeneratedLessons;