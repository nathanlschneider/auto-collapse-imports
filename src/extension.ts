import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  vscode.workspace.onDidOpenTextDocument((document) => {
    if (
      [
        'typescript',
        'typescriptreact',
        'javascript',
        'javascriptreact',
      ].includes(document.languageId)
    ) {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === document) {
        collapseLongBlocks(editor);
      }
    }
  });

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (
      editor &&
      [
        'typescript',
        'typescriptreact',
        'javascript',
        'javascriptreact',
      ].includes(editor.document.languageId)
    ) {
      collapseLongBlocks(editor);
    }
  });
}

function collapseLongBlocks(editor: vscode.TextEditor) {
  let startArr: number[] = [];
  const { document } = editor;

  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i);

    if (line.isEmptyOrWhitespace) {
      continue;
    }

    let start = i;
    while (i < document.lineCount && !document.lineAt(i).isEmptyOrWhitespace) {
      i++;
    }
    let end = i - 1;

    if (end - start >= 20) {
      startArr.push(start);
    }
  }
  console.log(startArr);
  vscode.commands.executeCommand('editor.fold', {
    levels: 1,
    direction: 'down',
    selectionLines: startArr,
  });
}

export function deactivate() {}
