import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const startArr: number[] = [];

  const processDocument = (document: vscode.TextDocument) => {
    startArr.length = 0; // Clear the array

    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);

      if (line.isEmptyOrWhitespace) {
        continue;
      }

      let start = i;
      let importCount = 0;
      while (i < document.lineCount && !document.lineAt(i).isEmptyOrWhitespace) {
        if (document.lineAt(i).text.startsWith('import ')) {
          importCount++;
        }
        i++;
      }

      if (importCount > 1) {
        startArr.push(start);
      }
    }

    vscode.commands.executeCommand('editor.fold', {
      levels: 1,
      direction: 'down',
    });
  };

  const onDidOpenTextDocument = vscode.workspace.onDidOpenTextDocument((document) => {
    if (document.languageId === 'typescript') {
      processDocument(document);
    }
  });

  const onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor && editor.document.languageId === 'typescript') {
      processDocument(editor.document);
    }
  });

  context.subscriptions.push(onDidOpenTextDocument, onDidChangeActiveTextEditor);

  // Process the currently active document if it exists
  const editor = vscode.window.activeTextEditor;
  if (editor && editor.document.languageId === 'typescript') {
    processDocument(editor.document);
  }
}

export function deactivate() {}
