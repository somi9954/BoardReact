import React from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from '../commons/InputStyle';
import EditorBox from '../commons/EditorBox';
import { BigButton, ButtonGroup } from '../commons/ButtonStyle';
import styled from 'styled-components';
import sizeNames from '../../styles/sizes';

const { medium } = sizeNames;

const FormBox = styled.form`
  dl {
    display: flex;
    padding: 10px 15px;
    align-items: center;
    dt {
      width: 130px;
      font-size: ${medium};
      font-weight: bold;
    }
    dd {
      flex-grow: 1;
    }
  }
  dl + dl {
    border-top: 1px solid #d5d5d5;
  }
  dl:last-of-type {
    margin-bottom: 15px;
  }
  .category {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
`;

const BoardUpdateForm = ({
  initialValues,
  form,
  onSubmit,
  onChange,
  handleEditorChange,
  userInfo,
  handleGoBack, // 뒤로 가는 함수 추가
}) => {
  const { t } = useTranslation();

  // 사용자가 업데이트를 허용하는지 확인하는 함수
  const isUserAllowedToUpdate = () => {
    return userInfo && form.poster === userInfo.nickname;
  };

  return (
    <FormBox onSubmit={onSubmit}>
      {/* 사용자가 업데이트를 허용할 경우에만 폼 내용을 렌더링합니다. */}
      {isUserAllowedToUpdate() ? (
        <>
          <dl>
            <dt>{t('분류')}</dt>
            <dd className="category">
              {initialValues.board.category.split('\n').map((cat, index) => (
                <div key={index} style={{ marginRight: '10px' }}>
                  <input
                    type="radio"
                    id={cat}
                    name="category"
                    value={cat}
                    checked={form.category === cat}
                    onChange={onChange}
                  />
                  <label htmlFor={cat}>{cat}</label>
                </div>
              ))}
            </dd>
          </dl>
          <dl>
            <dt>{t('제목')}</dt>
            <dd>
              <InputText
                type="text"
                name="subject"
                value={form.subject || ''}
                onChange={onChange}
              />
            </dd>
          </dl>
          <dl>
            <dt>{t('작성자')}</dt>
            <dd>
              <InputText
                type="text"
                id="poster"
                name="poster"
                value={form.poster || ''}
                onChange={onChange}
              />
            </dd>
          </dl>
          {initialValues.board.member && (
            <dl>
              <dt>{t('비밀번호')}</dt>
              <dd>
                <InputText
                  type="password"
                  name="guestPw"
                  value={form.guestPw || ''}
                  placeholder={t('게시글_수정_삭제시_비밀번호')}
                  onChange={onChange}
                />
              </dd>
            </dl>
          )}
          <dl>
            <dt>{t('내용')}</dt>
            <dd>
              <EditorBox
                content={form.content || ''}
                onEditorChange={handleEditorChange}
              />
            </dd>
          </dl>
          <ButtonGroup>
            <BigButton
              type="submit"
              color="info"
              bcolor="info"
              height="50px"
              size="medium"
            >
              {t('작성하기')}
            </BigButton>
            <BigButton
              type="reset"
              color="white"
              bcolor="info"
              height="50px"
              size="medium"
              fcolor="info"
            >
              {t('다시입력')}
            </BigButton>
          </ButtonGroup>
        </>
      ) : (
        <div>
          {t('게시글을 수정할 권한이 없습니다.')}
          <ButtonGroup>
            <BigButton
              type="button"
              color="white"
              bcolor="info"
              height="50px"
              size="medium"
              fcolor="info"
              onClick={handleGoBack}
            >
              {t('뒤로가기')}
            </BigButton>
          </ButtonGroup>
        </div>
      )}
    </FormBox>
  );
};

export default BoardUpdateForm;
