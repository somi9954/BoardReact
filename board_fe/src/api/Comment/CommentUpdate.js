import apiRequest from '../../lib/apiRequest';

export default function requestCommentUpdate(seq, updatedData) {
  return new Promise((resolve, reject) => {
    apiRequest(`/comment/update/${seq}`, 'PUT', updatedData)
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
