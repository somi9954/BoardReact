import { useTranslation } from 'react-i18next';
import {InputText } from '../../commons/InputStyle';
import React, { useState } from 'react';
import styled from 'styled-components';
import loadable from '@loadable/component';
import {BigButton, ButtonGroup } from '../../commons/ButtonStyle';
import sizeNames from '../../../styles/sizes';
import Menus from '../../../pages/admin/Menus';

const ErrorMessages = loadable(() => import('../../commons/ErrorMessages'));

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

  .agree_terms {
    font-size: ${medium};
    cursor: pointer;
    width: 100%;
    height: 6.25em;
    resize: none;
    border: 1px solid #d5d5d5;
  }

  .table-cols dt {
    width: 180px;
    padding: 10px 20px;
    text-align: left;
  }
`;


const SiteConfig = ({ onSubmit, onChange, form, errors }) => {
  const { t } = useTranslation();


  return (
    <FormBox onSubmit={onSubmit}>
      <div className="table-cols">
        <dl>
          <dt>{t('사이트 제목')}</dt>
          <dd>
            <InputText
              type="text"
              name="siteTitle"
              value={form.siteTitle || ''}
              onChange={onChange}
              placeholder="사이트 제목을 입력해주세요."
            />
            <ErrorMessages errors={errors} field="siteTitle" />
          </dd>
        </dl>
        <dl>
          <dt>{t('사이트 설명')}</dt>
          <dd>
            <InputText
              type="text"
              name="siteDescription"
              value={form.siteDescription || ''}
              onChange={onChange}
              placeholder="사이트 설명을 입력해주세요."
            />
            <ErrorMessages errors={errors} field="siteDescription" />
          </dd>
        </dl>
        <dl>
          <dt>{t('CSS, JS 버전')}</dt>
          <dd>
            <InputText
              type="number"
              name="cssJsVersion"
              value={form.cssJsVersion || ''}
              onChange={onChange}
            />
          </dd>
        </dl>
        <dl>
          <dt>{t('회원 가입 약관 설정')}</dt>
          <dd>
            <textarea
              className="agree_terms"
              name="joinTerms"
              value={form.joinTerms || ''}
              onChange={onChange}
              placeholder="회원 가입 약관을 입력해주세요."
            />
            <ErrorMessages errors={errors} field="joinTerms" />
          </dd>
        </dl>
        <ButtonGroup>
          <BigButton
            type="submit"
            color="info"
            $bcolor="info"
            height="50px"
            size="medium"
          >
            {t('작성하기')}
          </BigButton>
          <BigButton
            type="reset"
            color="white"
            $bcolor="info"
            height="50px"
            size="medium"
            fcolor="info"
          >
            {t('다시입력')}
          </BigButton>
        </ButtonGroup>
      </div>
    </FormBox>
  );
};

export default React.memo(SiteConfig);
