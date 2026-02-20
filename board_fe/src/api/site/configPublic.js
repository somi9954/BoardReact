import apiRequest from '../../lib/apiRequest';

export default function requestPublicConfigInfo() {
  return apiRequest('/config/public');
}
