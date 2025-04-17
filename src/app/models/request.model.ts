export interface CreateRequestBody {
  external_form_id: string;
  smart_action_id: string;
}

export interface CompleteRequestBody {
  status: string;
  smart_action_id: number;
  timestamp?: string;
  details?: {
    error_code?: string;
    message?: string;
  }
}
