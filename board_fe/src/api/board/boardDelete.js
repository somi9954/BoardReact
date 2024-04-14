import apiRequest from '../../lib/apiRequest';

export default function requestDelete(seq) {
  return new Promise((resolve, reject) => {
    apiRequest(`/board/delete/${seq}`, 'DELETE')
      .then((res) => {
        if (!res.data.success) {
          reject(res.data);
        } else {
          resolve(true);
        }
      })
      .catch((err) => reject(err));
  });
}
