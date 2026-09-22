import React, { useState } from 'react';
import { STUDENT_AVATARS, getStudentAvatar } from '../../data/classroom/studentAvatars';

interface Props {
  avatar?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showName?: boolean;
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-xl',
  xl: 'w-20 h-20 text-3xl',
};

export const StudentAvatarBadge: React.FC<Props> = ({
  avatar,
  size = 'md',
  className = '',
  showName = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const matched = avatar ? STUDENT_AVATARS.find(
    (a) => a.id.toLowerCase() === avatar.toLowerCase() || a.name.toLowerCase() === avatar.toLowerCase()
  ) : undefined;

  const currentAvatar = matched || getStudentAvatar(avatar);
  const isCustomStudent = Boolean(matched);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        className={`${SIZE_MAP[size]} rounded-2xl bg-gradient-to-br ${currentAvatar.bgColor} border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center justify-center overflow-hidden shrink-0 relative`}
      >
        {isCustomStudent && !imageError ? (
          <img
            src={currentAvatar.avatarUrl}
            alt={currentAvatar.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="select-none leading-none">
            {avatar && avatar.length <= 4 ? avatar : currentAvatar.fallbackEmoji}
          </span>
        )}
      </div>

      {showName && (
        <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
          {currentAvatar.name}
        </span>
      )}
    </div>
  );
};
