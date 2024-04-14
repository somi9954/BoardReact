import apiRequest from '../../lib/apiRequest';

export default function requestConfigDelete(bId) {
  return new Promise((resolve, reject) => {
    apiRequest(`/admin/board/${bId}`, 'DELETE')
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
