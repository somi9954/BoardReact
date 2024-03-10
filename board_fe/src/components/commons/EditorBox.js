import React, { Component } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

const toolbar = [['heading', 'bold', 'italic', 'strike'], ['hr', 'quote', 'ul', 'ol'], ['image']];

class EditorBox extends Component {
  render() {
    const { content, editorRef, imageHandler } = this.props;
    return (
      <Editor
        initialValue={content || ' '}
        previewStyle="vertical"
        theme=""
        usageStatistics={false}
        toolbarItems={toolbar}
        height="600px"
        initialEditType="wysiwyg"
        useCommandShortcut={false}
        plugins={[colorSyntax]}
        ref={editorRef}
        hooks={{
          addImageBlobHook: (blob, callback) => imageHandler(blob, callback),
        }}
      />
    );
  }
}

export default EditorBox;
