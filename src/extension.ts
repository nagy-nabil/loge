// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
        "loge.loge",
        () => {
            // The code you place here will be executed every time your command is executed
            let editor = vscode.window.activeTextEditor;
            // if no editor opened do nothing
            if (!editor) {
                return;
            }
            let position = editor.selections[0].active;
            const newPos = position.with(position.line + 1, 0);
            let document = editor.document;
            const langId = document.languageId;
            // if the lang not js or ts or rust do nothing more
            if (
                langId !== "javascript" &&
                langId !== "typescript" &&
                langId !== "rust"
            ) {
                return;
            }
            let range = document.getWordRangeAtPosition(position);
            let token = document.getText(range);
            // edit the document based on which lang is running
            editor?.edit((editor) => {
                const newInsert =
                    langId === "rust"
                        ? `println!("🪵 line \\"${position.line+1}\\" ~ token ~ ${token} {${token}}");`
                        : `console.log("🪵 line \\"${position.line+1}\\" ~ token ~ ${token}", ${token});`;
                editor.insert(newPos, `\n\t${newInsert}\n`);
            });
        }
    );
    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
