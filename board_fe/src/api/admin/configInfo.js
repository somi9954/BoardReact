import apiRequest from '../../lib/apiRequest';

export default function requestConfigInfo() {
  return apiRequest('/admin/config');
}

