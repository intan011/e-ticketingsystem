import { projectId, publicAnonKey } from './supabase/info';

const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-764b8bb4`;

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${baseUrl}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const api = {
  // Create a new submission
  createSubmission: async (submissionData: any) => {
    return apiCall('/submissions', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  },

  // Get all submissions
  getAllSubmissions: async () => {
    return apiCall('/submissions');
  },

  // Get submissions by email
  getSubmissionsByEmail: async (email: string) => {
    return apiCall(`/submissions/email/${encodeURIComponent(email)}`);
  },

  // Update submission status
  updateSubmissionStatus: async (id: string, status: string) => {
    return apiCall(`/submissions/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Get submission by ID
  getSubmissionById: async (id: string) => {
    return apiCall(`/submissions/${id}`);
  },

  // Health check
  healthCheck: async () => {
    return apiCall('/health');
  },
};