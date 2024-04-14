import apiRequest from '../../lib/apiRequest';

export default function requestWrite(form, bId) {
  return new Promise((resolve, reject) => {
    // 유효성 검사: bId가 유효한지 확인하고, 유효하지 않다면 오류 처리
    if (!bId || bId.trim() === '') {
      reject(new Error('bId가 유효하지 않습니다.'));
      return;
    }

    // 유효성 검사: content가 비어있는지 확인하고, 비어있다면 오류 처리
    if (!form.content || form.content.trim() === '') {
      reject(new Error('내용을 입력하세요.'));
      return;
    }

    const requestData = { ...form, bId: bId };

    // API 요청
    apiRequest(`/board/write/${bId}`, 'POST', requestData)
      .then((res) => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message));
        }
      })
      .catch((err) => {
        // 오류 처리
        reject(err);
      });
  });
}
