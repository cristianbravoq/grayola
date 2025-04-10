export type ProjectType = {
  id?: string;
  title: string;
  description?: string | null;
  user_id?: string;
  project_files?: ProjectFileType[];
};

export type ProjectFileType = {
  id?: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
};

export type FormStateType = {
  success?: boolean;
  error?: string;
};

export type DesignerType = {
  id: string;
  email: string;
};