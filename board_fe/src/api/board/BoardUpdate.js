import apiRequest from '../../lib/apiRequest';

export default function responseUpdate(seq, form) {
  return new Promise((resolve, reject) => {
    apiRequest(`/board/update/${seq}`, 'PUT', form)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}
