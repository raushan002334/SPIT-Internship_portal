import api from './axios';

// Generate groups with filters and settings
export const generateGroups = (data) => {
  return api.post('/groups/generate', data);
};

// List all existing groups
export const listGroups = () => {
  return api.get('/groups/list');
};

// Unassign students from groups
export const unassignStudents = (uids) => {
  return api.post('/groups/unassign', { uids });
};

// Check if students are already assigned
export const checkAssignment = (uids) => {
  return api.post('/groups/check-assignment', { uids });
};

// Export all groups to Excel
export const exportGroups = (groups) => {
  return api.post('/groups/export', { groups }, {
    responseType: 'blob',
  });
};

// Export single group to Excel
export const exportSingleGroup = (group) => {
  return api.post('/groups/export-single', { group }, {
    responseType: 'blob',
  });
};

// Random pick students
export const randomPick = (data) => {
  return api.post('/groups/random-pick', data);
};

// Export random picked students
export const exportRandom = (students) => {
  return api.post('/groups/export-random', { students }, {
    responseType: 'blob',
  });
};

// List all groups with mentor details
export const listGroupsWithMentors = () => {
  return api.get('/groups/list-with-mentors');
};

// Allocate external mentors to all groups
export const allocateExternalMentorsToAll = () => {
  return api.post('/groups/allocate-all-external');
};

// Allocate internal mentors to all groups
export const allocateInternalMentorsToAll = () => {
  return api.post('/groups/allocate-all-internal');
};

// Allocate external mentor to a specific group
export const allocateExternalMentorToGroup = (groupId) => {
  return api.post(`/groups/${groupId}/allocate-external-mentor`);
};

// Allocate internal mentor to a specific group
export const allocateInternalMentorToGroup = (groupId) => {
  return api.post(`/groups/${groupId}/allocate-internal-mentor`);
};

// Search groups by student or mentor name
export const searchGroups = (query) => {
  return api.get('/groups/search', {
    params: { query }
  });
};

// Sync mentor assignments (cleanup orphaned assignments)
export const syncMentors = () => {
  return api.post('/groups/sync-mentors');
};

// Update group details
export const updateGroup = (groupId, data) => {
  return api.put(`/groups/${groupId}`, data);
};

// Clear all groups
export const clearAllGroups = () => {
  return api.post('/groups/clear-all');
};

export default api;

