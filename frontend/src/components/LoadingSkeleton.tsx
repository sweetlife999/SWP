import React from 'react';

interface LoadingSkeletonProps {
  type?: 'member' | 'event' | 'questionnaire' | 'kanban' | 'news' | 'card';
  count?: number;
}

export function LoadingSkeleton({ type = 'card', count = 3 }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'member':
        return (
          <div className="person">
            <div className="photo skeleton-pulse" />
            <div className="body">
              <div className="skeleton-pulse" style={{ height: 18, width: '70%', marginBottom: 6 }} />
              <div className="skeleton-pulse" style={{ height: 12, width: '50%' }} />
            </div>
          </div>
        );
      case 'event':
        return (
          <div className="event-card">
            <div className="ec-cover skeleton-pulse" />
            <div className="ec-body">
              <div className="skeleton-pulse" style={{ height: 12, width: '40%', marginBottom: 8 }} />
              <div className="skeleton-pulse" style={{ height: 20, width: '80%', marginBottom: 6 }} />
              <div className="skeleton-pulse" style={{ height: 14, width: '60%' }} />
            </div>
          </div>
        );
      case 'questionnaire':
        return (
          <div className="q-list-card">
            <div className="skeleton-pulse" style={{ height: 12, width: '30%', marginBottom: 8 }} />
            <div className="skeleton-pulse" style={{ height: 18, width: '70%', marginBottom: 6 }} />
            <div className="skeleton-pulse" style={{ height: 14, width: '90%', marginBottom: 8 }} />
            <div className="skeleton-pulse" style={{ height: 12, width: '40%' }} />
          </div>
        );
      case 'news':
        return (
          <div className="news-row">
            <div className="thumb skeleton-pulse" />
            <div className="news-body">
              <div className="skeleton-pulse" style={{ height: 12, width: '40%', marginBottom: 8 }} />
              <div className="skeleton-pulse" style={{ height: 20, width: '80%', marginBottom: 6 }} />
              <div className="skeleton-pulse" style={{ height: 14, width: '90%' }} />
            </div>
          </div>
        );
      case 'kanban':
        return (
          <div className="kbc skeleton-pulse" style={{ borderLeft: '4px solid #e5e7eb' }}>
            <div className="skeleton-pulse" style={{ height: 18, width: '40%', marginBottom: 8 }} />
            <div className="skeleton-pulse" style={{ height: 16, width: '80%', marginBottom: 6 }} />
            <div className="skeleton-pulse" style={{ height: 12, width: '90%' }} />
          </div>
        );
      default:
        return (
          <div className="card" style={{ padding: 20 }}>
            <div className="skeleton-pulse" style={{ height: 20, width: '70%', marginBottom: 12 }} />
            <div className="skeleton-pulse" style={{ height: 14, width: '90%', marginBottom: 6 }} />
            <div className="skeleton-pulse" style={{ height: 14, width: '80%' }} />
          </div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
      ))}
    </>
  );
}
