import apiRequest from '../../lib/apiRequest';

export function requestMypageUpdate(form) {
  return apiRequest('/member/mypage', 'PATCH', form);
}

export function requestMypageDelete() {
  return apiRequest('/member/mypage', 'DELETE');
}

export const requestProfileImageUpload = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest('/member/mypage/profile-image', 'POST', formData);
};
