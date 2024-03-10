import apiRequest from '../../lib/apiRequest';

export default function requestWrite(form, bId) {
  return new Promise((resolve, reject) => {
    apiRequest(`/board/write/${bId}`, 'POST', form)
      .then((res) => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          reject(res.data.message);
        }
      })
      .catch((err) => reject(err));
  });
}