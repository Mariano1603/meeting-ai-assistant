export interface Meeting {
  id: string;
  title: string;
  description?: string;
  file_path: string;
  file_name: string;
  file_size: number;
  duration?: number;
  transcription?: string;
  summary?: string;
  status: MeetingStatus;
  user_id: string;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
}

export enum MeetingStatus {
  UPLOADING = "uploading",
  PROCESSING = "processing",
  TRANSCRIBING = "transcribing",
  SUMMARIZING = "summarizing",
  COMPLETED = "completed",
  FAILED = "failed"
}

export interface MeetingCreate {
  title: string;
  description?: string;
  file: File;
}

export interface MeetingUpdate {
  title?: string;
  description?: string;
}

export interface MeetingUpload {
  meeting_id: string;
  upload_url: string;
}

