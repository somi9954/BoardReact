import apiRequest from '../../lib/apiRequest';

export default function requestConfig(form) {
  return apiRequest('/admin/config', 'POST', form);
}
