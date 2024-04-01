import apiRequest from '../../lib/apiRequest';

export default function requestCommentWrite(formData) {
  return new Promise((resolve, reject) => {
    apiRequest('/comment/save', 'POST', formData)
      .then((res) => {
        console.log('응답 데이터:', res);

        if (!res.data.success) {
          reject(res.data);
        } else {
          resolve(true);
        }
      })
      .catch((err) => {
        // 요청이 실패하면 에러를 콘솔에 출력합니다.
        console.error('요청 실패:', err);
        reject(err);
      });
  });
}
