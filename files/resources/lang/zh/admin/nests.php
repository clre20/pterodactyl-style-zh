<?php

return [
    'notices' => [
        'created' => '已成功建立新的巢組 :name。',
        'deleted' => '已從面板刪除巢組。',
        'updated' => '已更新巢組設定。',
    ],
    'eggs' => [
        'notices' => [
            'imported' => '已成功匯入此蛋及其變數。',
            'updated_via_import' => '已使用上傳的檔案更新此蛋。',
            'deleted' => '已從面板刪除此蛋。',
            'updated' => '已成功更新蛋的設定。',
            'script_updated' => '已更新蛋的安裝腳本，之後安裝伺服器時都會執行。',
            'egg_created' => '已成功建立新的蛋。需要重新啟動執行中的節點才能套用。',
        ],
    ],
    'variables' => [
        'notices' => [
            'variable_deleted' => '變數「:variable」已刪除，伺服器重建後將無法再使用。',
            'variable_updated' => '變數「:variable」已更新。需要重建使用此變數的伺服器才能套用變更。',
            'variable_created' => '已成功建立新變數並指派給此蛋。',
        ],
    ],
];
