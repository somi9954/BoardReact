import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from '../commons/InputStyle';
import { ButtonGroup, BigButton } from '../commons/ButtonStyle';
import sizeNames from '../../styles/sizes';
import styled from 'styled-components';
import EditorBox from '../commons/EditorBox';
import ErrorMessages from '../commons/ErrorMessages';
import on from '../../images/button/on.png';
import off from '../../images/button/off.png';

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

  .radio-label {
    display: inline-flex;
    align-items: center;
  }

  .radio-label input[type='radio'] {
    display: none;
  }

  .radio-label .radio-image {
    width: 25px;
    margin-right: 5px;
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
    onSubmit(e);
  };

  return (
    <FormBox onSubmit={handleSubmit}>
      <input type="hidden" name="bId" value={bId} /> {/* bId 추가 */}
      <dl>
        <dt>{t('분류')}</dt>
        <dd>
          {categories.map((category, index) => (
            <span key={index} style={{ marginRight: '10px' }}>
              <label htmlFor={`category-${index}`} className="radio-label">
                <input
                  type="radio"
                  id={`category-${index}`}
                  name="category"
                  value={category}
                  checked={form.category === category}
                  onChange={onChange}
                />
                {form.category === category ? (
                  <img src={on} alt="Selected" className="radio-image" />
                ) : (
                  <img src={off} alt="Unselected" className="radio-image" />
                )}
                {category}
              </label>
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
