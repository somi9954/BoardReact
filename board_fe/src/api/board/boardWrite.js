import apiRequest from '../../lib/apiRequest';

export default function requestWrite(form, tId) {
  return new Promise((resolve, reject) => {
    apiRequest(`/board/write/${tId}`, 'POST', form)
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