import React from 'react';
import GeneratedLessons from '@/components/teacher/generatedLessons';

const GeneratedLessonsPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Generated Lesson Plans</h1>
      <GeneratedLessons />
    </div>
  );
};

export default GeneratedLessonsPage;