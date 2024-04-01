import apiRequest from '../../lib/apiRequest';

export default function responseView(seq) {
  return new Promise((resolve, reject) => {
    apiRequest(`/board/view/${seq}`, 'GET')
      .then((res) => {
        if (!res.data.success) {
          reject(res.data);
        } else {
          // 서버 응답 데이터 전체를 resolve에 전달
          resolve(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
}
