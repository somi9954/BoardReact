import apiRequest from '../../lib/apiRequest';

export default function responseList(form) {
  return new Promise((resolve, reject) => {
    apiRequest('/admin/board/list', 'GET', form)
      .then((res) => {
        if (!res.data.success) {
          reject(new Error('Failed to fetch board list'));
        } else {
          resolve(true);
        }
      })
      .catch((err) => reject(err));
  });
}
