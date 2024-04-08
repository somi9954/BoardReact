import apiRequest from '../../lib/apiRequest';

export default function RequestConfigWriteChange(bId, form) {
  console.log('전송되는 데이터:', form);
  return new Promise((resolve, reject) => {
    apiRequest(`/admin/board/edit/${bId}`, 'PUT', form)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}
