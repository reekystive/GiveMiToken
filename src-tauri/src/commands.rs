use tauri::{AppHandle, Manager};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn eval_js(app: AppHandle, win_label: &str, code: &str) {
    let webview = app.get_webview_window(win_label);
    if let Some(webview) = webview {
        let result = webview.eval(code);
        if let Err(e) = result {
            println!("command eval_js: Webview {} error: {}", win_label, e);
        }
    } else {
        println!("command eval_js: Webview {} not found", win_label);
    }
}
