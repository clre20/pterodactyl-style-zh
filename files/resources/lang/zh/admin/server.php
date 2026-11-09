<?php

return [
    'exceptions' => [
        'no_new_default_allocation' => '您正嘗試刪除此伺服器的預設連接埠，但沒有其他連接埠可以替代。',
        'marked_as_failed' => '此伺服器先前的安裝被標記為失敗，目前無法切換安裝狀態。',
        'skipping_install_script' => '此伺服器設定為略過蛋的安裝腳本，停用該設定前無法重新安裝。',
        'bad_variable' => '變數 :name 驗證失敗。',
        'daemon_exception' => '與節點通訊時發生錯誤，回應代碼為 HTTP/:code。此錯誤已記錄。（請求 ID：:request_id）',
        'default_allocation_not_found' => '在此伺服器的連接埠中找不到指定的預設連接埠。',
    ],
    'alerts' => [
        'startup_changed' => '已更新此伺服器的啟動設定。若變更了巢組或蛋，伺服器將立即重新安裝。',
        'server_deleted' => '已從系統刪除伺服器。',
        'server_created' => '已在面板建立伺服器。請給節點幾分鐘時間完成安裝。',
        'build_updated' => '已更新此伺服器的資源配置，部分變更需要重新啟動才會生效。',
        'suspension_toggled' => '伺服器停權狀態已變更為 :status。',
        'rebuild_on_boot' => '此伺服器已標記為需要重建 Docker 容器，將在下次啟動時進行。',
        'install_toggled' => '已切換此伺服器的安裝狀態。',
        'server_reinstalled' => '此伺服器已排入重新安裝，即將開始。',
        'details_updated' => '已成功更新伺服器資料。',
        'docker_image_updated' => '已變更此伺服器的預設 Docker 映像檔，需要重新啟動才能套用。',
        'node_required' => '新增伺服器前，必須先設定至少一個節點。',
        'transfer_nodes_required' => '轉移伺服器前，必須設定至少兩個節點。',
        'transfer_started' => '已開始轉移伺服器。',
        'transfer_not_viable' => '所選節點的磁碟空間或記憶體不足，無法容納此伺服器。',
    ],
];
