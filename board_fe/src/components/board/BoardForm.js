import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from '../commons/InputStyle';
import { ButtonGroup, BigButton } from '../commons/ButtonStyle';
import sizeNames from '../../styles/sizes';
import styled from 'styled-components';
import loadable from '@loadable/component';
import EditorBox from '../commons/EditorBox'; // EditorBox import 추가
import ErrorMessages from '../commons/ErrorMessages';

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
`;

const BoardForm = ({
  onSubmit,
  onChange,
  form,
  errors,
  categories,
  user,
  showPasswordField,
  bId,
  handleEditorChange,
}) => {
  const { t } = useTranslation();

  const content = form.content || '';

  const handleSubmit = (e) => {
    e.preventDefault();
    // 내용이 비어 있는지 확인
    if (!form.content || form.content.trim() === '') {
      onChange({
        ...form,
        errors: {
          ...errors,
          content: '내용을 입력하세요.',
        },
      });
      return;
    }
    console.log('Form submitted!'); // 콘솔 로그 추가
    onSubmit(e);
  };

  return (
    <FormBox onSubmit={handleSubmit}>
      <dl>
        <dt>{t('분류')}</dt>
        <dd>
          {categories.map((category, index) => (
            <span key={index} style={{ marginRight: '10px' }}>
              <input
                type="radio"
                id={`category-${index}`}
                name="category"
                value={category}
                checked={form.category === category}
                onChange={onChange}
              />
              <label htmlFor={`category-${index}`}>{category}</label>
            </span>
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
          <ErrorMessages errors={errors} field="subject" />
        </dd>
      </dl>
      <dl>
        <dt>{t('작성자')}</dt>
        <dd>
          <InputText
            type="text"
            name="poster"
            value={user ? user.nickname : form.poster || ''}
            onChange={onChange}
            readOnly={user ? true : false}
          />
        </dd>
      </dl>
      {showPasswordField && (
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
            content={form.content}
            onEditorChange={handleEditorChange}
          />
          <ErrorMessages errors={errors} field="content" />{' '}
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
    </FormBox>
  );
};

export default React.memo(BoardForm);
