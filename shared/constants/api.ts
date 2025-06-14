export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  
  // Users
  USERS: '/users',
  ME: '/users/me',
  
  // Meetings
  MEETINGS: '/meetings',
  MEETING_UPLOAD: '/meetings/upload',
  MEETING_PROCESS: '/meetings/{id}/process',
  
  // Tasks
  TASKS: '/tasks',
  MEETING_TASKS: '/meetings/{meetingId}/tasks',
  
  // AI Services
  TRANSCRIBE: '/ai/transcribe',
  SUMMARIZE: '/ai/summarize',
  EXTRACT_TASKS: '/ai/extract-tasks',
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const API_V1_PREFIX = '/api/v1';

export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ACCEPTED_FORMATS: [
    'audio/mp3',
    'audio/wav', 
    'audio/m4a',
    'audio/mpeg',
    'video/mp4',
    'video/avi',
    'video/mov'
  ],
} as const;

