import apiRequest from '../../lib/apiRequest';

export default function responseAdminList() {
  return new Promise((resolve, reject) => {
    apiRequest('/admin/board/list', 'GET')
      .then((res) => {
        console.log('Admin List Response:', res); // 데이터 출력
        if (!res.data.success) {
          reject(res.data);
        } else {
          resolve(res.data); // 데이터 반환
        }
      })
      .catch((err) => reject(err));
  });
}
