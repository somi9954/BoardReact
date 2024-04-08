import apiRequest from '../../lib/apiRequest';

export default function responseAdminList() {
  return new Promise((resolve, reject) => {
    apiRequest('/admin/board/list', 'GET')
      .then((res) => {
        console.log('Admin List Response:', res);
        if (!res.data || !res.data.success) {
          reject('Admin list request failed');
        } else {
          resolve(res.data); // 데이터 반환
        }
      })
      .catch((err) => reject(err));
  });
}
