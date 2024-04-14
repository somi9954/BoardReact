import apiRequest from '../../lib/apiRequest';

export default function requestCommentWrite(formData) {
  return new Promise((resolve, reject) => {
    apiRequest('/comment/save', 'POST', formData)
      .then((res) => {
        if (!res.data.success) {
          reject(res.data);
        } else {
          resolve(true);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}
