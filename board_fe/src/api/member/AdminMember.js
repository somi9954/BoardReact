import apiRequest from '../../lib/apiRequest';

export function requestMemberTypeUpdate(userNo, type) {
  return apiRequest(`/member/admin/${userNo}/type`, 'PATCH', { type });
}

export function requestMemberDelete(userNo) {
  return apiRequest(`/member/admin/${userNo}`, 'DELETE');
}
