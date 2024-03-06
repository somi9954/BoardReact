import apiRequest from '../../lib/apiRequest';

export default function requestDelete(seq) {
  return new Promise((resolve, reject) => {
    // 서버에 DELETE 요청 보내기
    apiRequest(`/board/delete/${seq}`, 'DELETE')
      .then((res) => {
        // 서버 응답이 성공일 때
        if (res.status === 200) {
          // 성공적으로 처리된 경우
          resolve(true);
          console.log('삭제 성공', res);
        } else {
          // 실패한 경우
          reject(new Error('삭제 실패'));
          console.log('삭제 실패', res);
        }
      })
      .catch((err) => {
        // 요청 자체가 실패한 경우
        reject(err);
      });
  });
}
