<?php

return [
    'validation' => [
        'fqdn_not_resolvable' => '提供的 FQDN 或 IP 位址無法解析為有效的 IP 位址。',
        'fqdn_required_for_ssl' => '此節點使用 SSL 時，必須提供可解析為公開 IP 的完整網域名稱。',
    ],
    'notices' => [
        'allocations_added' => '已成功新增連接埠到此節點。',
        'node_deleted' => '已從面板移除節點。',
        'location_required' => '新增節點前，必須先設定至少一個位置。',
        'node_created' => '已成功建立節點。您可以到「設定檔」分頁自動設定此機器上的節點。新增伺服器前，必須先配置至少一個 IP 位址與連接埠。',
        'node_updated' => '已更新節點資訊。若變更了節點設定，需要重新啟動節點才會生效。',
        'unallocated_deleted' => '已刪除 <code>:ip</code> 所有未使用的連接埠。',
    ],
];
