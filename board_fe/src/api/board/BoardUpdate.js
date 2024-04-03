import apiRequest from '../../lib/apiRequest';

export default function responseUpdate(seq, form) {
  console.log('전송되는 데이터:', form);
  return new Promise((resolve, reject) => {
    apiRequest(`/board/update/${seq}`, 'PUT', form)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}
