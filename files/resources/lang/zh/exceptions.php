<?php

return [
    'daemon_connection_failed' => '與節點通訊時發生錯誤，回應代碼為 HTTP/:code。此錯誤已記錄。',
    'node' => [
        'servers_attached' => '節點上必須沒有任何伺服器才能刪除。',
        'daemon_off_config_updated' => '已更新節點設定，但自動更新節點上的設定檔時發生錯誤。您需要手動更新節點的設定檔（config.yml）才能套用變更。',
    ],
    'allocations' => [
        'server_using' => '此連接埠目前已指派給伺服器，只有未指派的連接埠才能刪除。',
        'too_many_ports' => '不支援一次新增超過 1000 個連接埠的範圍。',
        'invalid_mapping' => ':port 的對應設定無效，無法處理。',
        'cidr_out_of_range' => 'CIDR 格式只允許 /25 到 /32 之間的遮罩。',
        'port_out_of_range' => '連接埠必須大於 1024 且小於或等於 65535。',
    ],
    'nest' => [
        'delete_has_servers' => '無法刪除仍有伺服器使用的巢組。',
        'egg' => [
            'delete_has_servers' => '無法刪除仍有伺服器使用的蛋。',
            'invalid_copy_id' => '所選要複製腳本的蛋不存在，或本身也是複製其他蛋的腳本。',
            'must_be_child' => '此蛋的「複製設定來源」必須是所選巢組中的選項。',
            'has_children' => '此蛋是其他蛋的來源。請先刪除那些蛋，再刪除此蛋。',
        ],
        'variables' => [
            'env_not_unique' => '環境變數 :name 在此蛋中必須是唯一的。',
            'reserved_name' => '環境變數 :name 受到保護，無法指派給變數。',
            'bad_validation_rule' => '驗證規則「:rule」不是有效的規則。',
        ],
        'importer' => [
            'json_error' => '解析 JSON 檔案時發生錯誤：:error。',
            'file_error' => '上傳的 JSON 檔案無效。',
            'invalid_json_provided' => '無法辨識上傳的 JSON 檔案格式。',
        ],
    ],
    'subusers' => [
        'editing_self' => '不允許編輯自己的子使用者帳戶。',
        'user_is_owner' => '無法將伺服器擁有者新增為子使用者。',
        'subuser_exists' => '使用此電子郵件的使用者已經是此伺服器的子使用者。',
    ],
    'databases' => [
        'delete_has_databases' => '無法刪除仍有資料庫的資料庫主機。',
    ],
    'tasks' => [
        'chain_interval_too_long' => '連續任務的最長間隔時間為 15 分鐘。',
    ],
    'locations' => [
        'has_nodes' => '無法刪除仍有節點的位置。',
    ],
    'users' => [
        'node_revocation_failed' => '撤銷 <a href=":link">節點 #:node</a> 上的金鑰失敗。:error',
    ],
    'deployment' => [
        'no_viable_nodes' => '找不到符合自動部署條件的節點。',
        'no_viable_allocations' => '找不到符合自動部署條件的連接埠。',
    ],
    'api' => [
        'resource_not_found' => '要求的資源不存在於此伺服器。',
    ],
];
