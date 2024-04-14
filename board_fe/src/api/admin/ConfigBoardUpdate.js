import apiRequest from '../../lib/apiRequest';

export default function RequestConfigWriteChange(bId, form) {
  return new Promise((resolve, reject) => {
    apiRequest(`/admin/board/edit/${bId}`, 'PUT', form)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}
