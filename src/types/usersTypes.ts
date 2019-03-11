import { TogglWorkspace } from './workspacesTypes';

// TODO: Add the other options here.
export enum ClockifyUserStatus {
  Active = 'ACTIVE',
}

export interface ClockifyMembership {
  userId: string;
  hourlyRate: number | null;
  membershipType: string;
  membershipStatus: string;
  target: string;
}

export interface ClockifyUser {
  id: string;
  email: string;
  name: string;
  memberships: ClockifyMembership[];
  profilePicture: string;
  activeWorkspace: string;
  defaultWorkspace: string;
  settings: {
    weekStart: string;
    timeZone: string;
    timeFormat: string;
    dateFormat: string;
    sendNewsletter: boolean;
    weeklyUpdates: boolean;
    longRunning: boolean;
    summaryReportSettings: {
      group: string;
      subgroup: string;
    };
    isCompactViewOn: boolean;
    dashboardSelection: string;
    timeTrackingManual: boolean;
  };
  status: string;
}

export interface TogglUser {
  id: number;
  default_wid: number;
  email: string;
  fullname: string;
  jquery_timeofday_format: string;
  jquery_date_format: string;
  timeofday_format: string;
  date_format: string;
  store_start_and_stop_time: boolean;
  beginning_of_week: number;
  language: string;
  image_url: string;
  sidebar_piechart: false;
  at: string;
  retention: number;
  record_timeline: boolean;
  render_timeline: boolean;
  timeline_enabled: boolean;
  timeline_experiment: boolean;
  new_blog_post: any;
  should_upgrade: boolean;
  invitation: any;
  userGroupIds?: string[];
}

export interface TogglWorkspaceUser {
  id: number;
  uid: number;
  wid: number;
  admin: boolean;
  owner: boolean;
  active: boolean;
  email: string;
  timezone: string;
  inactive: boolean;
  at: string;
  name: string;
  group_ids: number[] | null;
  rate: string | null;
  labour_cost: string | null;
  invite_url: string | null;
  invitation_code: string | null;
  avatar_file_name: string | null;
}

export interface TogglMeResponse {
  since: number;
  data: {
    id: number;
    default_wid: number;
    email: string;
    fullname: string;
    at: string;
    created_at: string;
    timezone: string;
    workspaces: TogglWorkspace[];
  };
}

export interface UserModel {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean | null;
  isActive: boolean;
  userGroupIds: string[] | null;
  linkedId: string | null;
  isIncluded: boolean;
}

export interface AddUsersToWorkspaceRequest {
  emails: string[];
}
