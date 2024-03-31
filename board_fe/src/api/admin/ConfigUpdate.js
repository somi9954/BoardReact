import apiRequest from '../../lib/apiRequest';

export default function RequestConfigWrite(form) {
  console.log('전송되는 데이터:', form);
  return new Promise((resolve, reject) => {
    apiRequest('/admin/board/update', 'PUT', form)
      .then((res) => {
        resolve(res); // 서버에서 반환된 데이터를 그대로 전달합니다.
      })
      .catch((err) => reject(err)); // 발생한 에러를 그대로 전달합니다.
  });
}
