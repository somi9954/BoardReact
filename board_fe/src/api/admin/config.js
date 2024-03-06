import apiRequest from '../../lib/apiRequest';

export default function requestConfig(form) {
  return new Promise((resolve, reject) => {
    apiRequest('/admin/config', 'POST', form)
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
