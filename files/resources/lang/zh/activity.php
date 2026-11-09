<?php

/**
 * Contains all of the translation strings for different activity log
 * events. These should be keyed by the value in front of the colon (:)
 * in the event name. If there is no colon present, they should live at
 * the top level.
 */
return [
    'auth' => [
        'fail' => '登入失敗',
        'success' => '已登入',
        'password-reset' => '已重設密碼',
        'reset-password' => '已要求重設密碼',
        'checkpoint' => '已要求雙重驗證',
        'recovery-token' => '已使用雙重驗證復原碼',
        'token' => '已通過雙重驗證',
        'ip-blocked' => '已封鎖來自未列出 IP 的 :identifier 請求',
        'sftp' => [
            'fail' => 'SFTP 登入失敗',
        ],
    ],
    'user' => [
        'user' => [
            'create' => '已建立新使用者 :email',
        ],
        'account' => [
            'email-changed' => '已將電子郵件從 :old 變更為 :new',
            'password-changed' => '已變更密碼',
        ],
        'api-key' => [
            'create' => '已建立新的 API 金鑰 :identifier',
            'delete' => '已刪除 API 金鑰 :identifier',
        ],
        'ssh-key' => [
            'create' => '已將 SSH 金鑰 :fingerprint 新增到帳戶',
            'delete' => '已從帳戶移除 SSH 金鑰 :fingerprint',
        ],
        'two-factor' => [
            'create' => '已啟用雙重驗證',
            'delete' => '已停用雙重驗證',
        ],
    ],
    'server' => [
        'reinstall' => '已重新安裝伺服器',
        'console' => [
            'command' => '已在伺服器上執行「:command」',
        ],
        'power' => [
            'start' => '已啟動伺服器',
            'stop' => '已停止伺服器',
            'restart' => '已重新啟動伺服器',
            'kill' => '已強制終止伺服器程序',
        ],
        'backup' => [
            'download' => '已下載備份 :name',
            'delete' => '已刪除備份 :name',
            'restore' => '已還原備份 :name（刪除檔案：:truncate）',
            'restore-complete' => '已完成備份 :name 的還原',
            'restore-failed' => '備份 :name 還原失敗',
            'start' => '已開始新的備份 :name',
            'complete' => '已將備份 :name 標記為完成',
            'fail' => '已將備份 :name 標記為失敗',
            'lock' => '已鎖定備份 :name',
            'unlock' => '已解除鎖定備份 :name',
        ],
        'database' => [
            'create' => '已建立新資料庫 :name',
            'rotate-password' => '已更換資料庫 :name 的密碼',
            'delete' => '已刪除資料庫 :name',
        ],
        'file' => [
            'compress_one' => '已壓縮 :directory:files.0',
            'compress_other' => '已壓縮 :directory 中的 :count 個檔案',
            'read' => '已查看 :file 的內容',
            'copy' => '已建立 :file 的副本',
            'create-directory' => '已建立資料夾 :directory:name',
            'decompress' => '已解壓縮 :directory 中的 :files',
            'delete_one' => '已刪除 :directory:files.0',
            'delete_other' => '已刪除 :directory 中的 :count 個檔案',
            'download' => '已下載 :file',
            'pull' => '已從 :url 下載遠端檔案到 :directory',
            'rename_one' => '已將 :directory:files.0.from 重新命名為 :directory:files.0.to',
            'rename_other' => '已重新命名 :directory 中的 :count 個檔案',
            'write' => '已寫入新內容到 :file',
            'upload' => '已開始上傳檔案',
            'uploaded' => '已上傳 :directory:file',
        ],
        'sftp' => [
            'denied' => '因權限不足已封鎖 SFTP 存取',
            'create_one' => '已建立 :files.0',
            'create_other' => '已建立 :count 個新檔案',
            'write_one' => '已修改 :files.0 的內容',
            'write_other' => '已修改 :count 個檔案的內容',
            'delete_one' => '已刪除 :files.0',
            'delete_other' => '已刪除 :count 個檔案',
            'create-directory_one' => '已建立資料夾 :files.0',
            'create-directory_other' => '已建立 :count 個資料夾',
            'rename_one' => '已將 :files.0.from 重新命名為 :files.0.to',
            'rename_other' => '已重新命名或移動 :count 個檔案',
        ],
        'allocation' => [
            'create' => '已將 :allocation 新增到伺服器',
            'notes' => '已將 :allocation 的備註從「:old」更新為「:new」',
            'primary' => '已將 :allocation 設為伺服器的主要連接埠',
            'delete' => '已刪除連接埠 :allocation',
        ],
        'schedule' => [
            'create' => '已建立排程 :name',
            'update' => '已更新排程 :name',
            'execute' => '已手動執行排程 :name',
            'delete' => '已刪除排程 :name',
        ],
        'task' => [
            'create' => '已在排程 :name 中建立「:action」任務',
            'update' => '已更新排程 :name 中的「:action」任務',
            'delete' => '已刪除排程 :name 中的任務',
        ],
        'settings' => [
            'rename' => '已將伺服器名稱從 :old 變更為 :new',
            'description' => '已將伺服器說明從 :old 變更為 :new',
        ],
        'startup' => [
            'edit' => '已將變數 :variable 從「:old」變更為「:new」',
            'image' => '已將伺服器的 Docker 映像檔從 :old 更新為 :new',
        ],
        'subuser' => [
            'create' => '已新增子使用者 :email',
            'update' => '已更新子使用者 :email 的權限',
            'delete' => '已移除子使用者 :email',
        ],
    ],
];
