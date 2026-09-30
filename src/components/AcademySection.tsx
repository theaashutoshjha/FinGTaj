import React, { useState } from 'react';
import { COURSES } from '../data/courses';
import { CourseModule } from '../types';
import { GraduationCap, BookOpen, Clock, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface AcademySectionProps {
  onSelectCourse: (course: CourseModule) => void;
}

export const AcademySection: React.FC<AcademySectionProps> = ({ onSelectCourse }) => {
  const [expandedCourse, setExpandedCourse] = useState<string | null>('course-foundations');

  return (
    <section style={{ padding: '60px 0' }} id="academy">
      <div className="wrap">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="badge badge-purple">
              <GraduationCap size={13} />
              Structured Wealth Curriculum
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: '12px' }}>
            FingTaj <span className="text-gradient">Finance Academy</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '15px' }}>
            Self-paced, modular knowledge tracks engineered to turn personal finance from an emotional gamble into an institutional discipline.
          </p>
        </div>

        {/* Courses Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {COURSES.map(course => {
            const isExpanded = expandedCourse === course.id;
            return (
              <div 
                key={course.id}
                className="glass-card"
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Level Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span className={`badge ${
                      course.level === 'Beginner' ? 'badge-cyan' : (course.level === 'Intermediate' ? 'badge-emerald' : 'badge-purple')
                    }`}>
                      {course.level} TRACK
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> {course.duration}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '20px', lineHeight: 1.4, marginBottom: '12px' }}>
                    {course.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
                    {course.desc}
                  </p>

                  {/* Modules stats */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '12px',
                    color: 'var(--accent-cyan)',
                    marginBottom: '20px'
                  }}>
                    <BookOpen size={14} />
                    <span>{course.lessonsCount} Core Syllabus Lessons</span>
                  </div>

                  {/* Syllabus Toggle */}
                  <div style={{
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(4, 10, 20, 0.6)',
                    overflow: 'hidden',
                    marginBottom: '20px'
                  }}>
                    <button
                      onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <span>CURRICULUM CHAPTERS ({course.syllabus.length})</span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isExpanded && (
                      <div style={{ padding: '0 16px 14px', borderTop: '1px solid var(--border-subtle)' }}>
                        {course.syllabus.map((syl, sIdx) => (
                          <div key={sIdx} style={{ padding: '8px 0', borderBottom: sIdx < course.syllabus.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <CheckCircle2 size={13} color="var(--accent-emerald)" />
                              {syl.title}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', paddingLeft: '19px' }}>
                              {syl.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Start Course CTA */}
                <button 
                  className="btn btn-primary"
                  onClick={() => onSelectCourse(course)}
                  style={{ width: '100%', padding: '12px' }}
                >
                  Start Course Free ↗
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
