<?php

return [
    'email' => [
        'title' => '更新電子郵件',
        'updated' => '您的電子郵件地址已更新。',
    ],
    'password' => [
        'title' => '變更密碼',
        'requirements' => '新密碼長度至少需要 8 個字元。',
        'updated' => '您的密碼已更新。',
    ],
    'two_factor' => [
        'button' => '設定雙重驗證',
        'disabled' => '已停用您帳戶的雙重驗證，登入時將不再需要輸入驗證碼。',
        'enabled' => '已啟用您帳戶的雙重驗證！之後登入時，都需要輸入裝置產生的驗證碼。',
        'invalid' => '驗證碼無效。',
        'setup' => [
            'title' => '設定雙重驗證',
            'help' => '無法掃描 QR 碼？請在應用程式中輸入下方代碼：',
            'field' => '輸入驗證碼',
        ],
        'disable' => [
            'title' => '停用雙重驗證',
            'field' => '輸入驗證碼',
        ],
    ],
];
