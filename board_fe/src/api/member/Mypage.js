import apiRequest from '../../lib/apiRequest';

export function requestMypageUpdate(form) {
  return apiRequest('/member/mypage', 'PATCH', form);
}

export function requestMypageDelete() {
  return apiRequest('/member/mypage', 'DELETE');
}
