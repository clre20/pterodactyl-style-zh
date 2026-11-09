<?php

namespace Pterodactyl\Notifications;

use Pterodactyl\Models\User;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class MailTested extends Notification
{
    public function __construct(private User $user)
    {
    }

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail(): MailMessage
    {
        return (new MailMessage())
            ->subject(__('Pterodactyl Test Message'))
            ->greeting(__('Hello :name!', ['name' => $this->user->name]))
            ->line(__('This is a test of the Pterodactyl mail system. You\'re good to go!'));
    }
}
