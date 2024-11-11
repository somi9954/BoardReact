import apiRequest from '../../lib/apiRequest';

export default function responseList() {
  return new Promise((resolve, reject) => {
    apiRequest(`/member/admin/memberList`, 'GET')
      .then((res) => {
        console.log('response', res); // 응답 데이터 전체 출력
        if (Array.isArray(res.data)) {
          resolve(res.data);
        } else {
          console.error('Invalid data format:', res.data); // 데이터 구조 확인
          reject('Invalid response format');
        }
      })
      .catch((err) => {
        console.error('API request failed:', err);
        reject(err);
      });
  });
}
