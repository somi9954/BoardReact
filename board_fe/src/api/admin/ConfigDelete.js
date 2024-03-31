import apiRequest from '../../lib/apiRequest';

export default function requestDelete(bId) {
  return new Promise((resolve, reject) => {
    apiRequest(`/admin/board/delete/${bId}`, 'DELETE')
      .then((res) => {
        console.log('서버 응답:', res);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
