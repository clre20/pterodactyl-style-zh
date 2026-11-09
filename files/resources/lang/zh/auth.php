<?php

return [
    'sign_in' => '登入',
    'go_to_login' => '前往登入',
    'failed' => '找不到符合此帳號密碼的帳戶。',

    'forgot_password' => [
        'label' => '忘記密碼？',
        'label_help' => '請輸入帳戶的電子郵件地址，我們會寄送重設密碼的說明給您。',
        'button' => '找回帳戶',
    ],

    'reset_password' => [
        'button' => '重設並登入',
    ],

    'two_factor' => [
        'label' => '雙重驗證碼',
        'label_help' => '此帳戶需要第二層驗證才能繼續。請輸入裝置產生的驗證碼以完成登入。',
        'checkpoint_failed' => '雙重驗證碼無效。',
    ],

    'throttle' => '登入嘗試次數過多，請在 :seconds 秒後再試。',
    'password_requirements' => '密碼長度至少需要 8 個字元，且不要與其他網站共用。',
    '2fa_must_be_enabled' => '管理員要求您的帳戶必須啟用雙重驗證才能使用面板。',
];
