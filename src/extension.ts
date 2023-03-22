// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import path = require("path");
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand("loge.loge", async () => {
        // The code you place here will be executed every time your command is executed
        let editor = vscode.window.activeTextEditor;
        // if no editor opened do nothing
        if (!editor) {
            return;
        }
        let position = editor.selection.active;
        // position where selection start
        const anchor = editor.selection.anchor;
        let document = editor.document;
        const langId = document.languageId;
        // if the lang not js or ts or rust do nothing more
        if (
            langId !== "javascript" &&
            langId !== "typescript" &&
            langId !== "rust" &&
            langId !== "typescriptreact" &&
            langId !== "javascriptreact"
        ) {
            return;
        }
        // if the anchor in not the same as cursor position means there's selection and selection has high priority in the loggin, else the extension will try to get the current word under the cursor
        let range: vscode.Range | undefined;
        if (anchor.isEqual(position)) {
            range = document.getWordRangeAtPosition(position);
        } else {
            range = new vscode.Range(position, anchor);
        }
        // only get the token if there's a range else return and do nothing better than trying to print to whole document
        let token: string;
        if (range !== undefined) {
            token = document.getText(range);
        } else {
            return;
        }
        // use built in command to add new line down just easir than managing the new line myself
        await vscode.commands.executeCommand("editor.action.insertLineAfter");
        // position after inserting new line
        const insertPos = editor.selection.active;
        // edit the document based on which lang is running
        editor?.edit((editor) => {
            const fName = path.basename(document.fileName);
            const newInsert =
                langId === "rust"
                    ? `println!("🪵 [${fName}:${
                        position.line + 1
                    }]~ token ~ \\x1b[0;32m${token}\\x1b[0m = {}", ${token});`
                    : `console.log("🪵 [${fName}:${
                        position.line + 1
                    }] ~ token ~ \\x1b[0;32m${token}\\x1b[0m = ", ${token});`;
            editor.insert(insertPos, `${newInsert}`);
        });
    });
    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
