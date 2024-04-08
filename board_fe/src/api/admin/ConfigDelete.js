import apiRequest from '../../lib/apiRequest';

export default function requestConfigDelete(bId) {
  return new Promise((resolve, reject) => {
    apiRequest(`/admin/board/${bId}`, 'DELETE')
      .then((res) => {
        if (!res.data.success) {
          reject(res.data);
        } else {
          resolve(true);
          console.log('삭제 성공', res);
        }
      })
      .catch((err) => reject(err));
  });
}
